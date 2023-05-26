<?php /** @noinspection MissingParentCallInspection */

namespace App\Restify;

use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Fields\Field;
use Binaryk\LaravelRestify\Fields\FieldCollection;
use Binaryk\LaravelRestify\Http\Controllers\RepositoryAttachController;
use Binaryk\LaravelRestify\Http\Controllers\RepositorySyncController;
use Binaryk\LaravelRestify\Http\Requests\RepositoryAttachRequest;
use Binaryk\LaravelRestify\Http\Requests\RepositorySyncRequest;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;
use Binaryk\LaravelRestify\Repositories\Repository as RestifyRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Nette\Utils\Json;
use Symfony\Component\HttpFoundation\Response;

abstract class Repository extends RestifyRepository
{

    public static function authorizedToStore(Request $request): bool
    {
        return true;
    }

    public function authorizedTo(Request $request, iterable|string $ability): bool
    {
        return true;
    }

    public static function authorizedToUseRepository(Request $request): bool
    {
        return true;
    }

    public static function authorizedToStoreBulk(Request $request): bool
    {
        return true;
    }

    public static function authorizedToUseRoute(Request $request): bool
    {
        return true;
    }

    /**
     * @psalm-suppress MissingParamType
     */
    public function allowToStore(RestifyRequest $request, $payload = null): RestifyRepository
    {
        $this->adaptJsonApiRequest($request);

        return parent::allowToStore($request, $payload);
    }

    /**
     * @psalm-suppress MissingParamType
     */
    public function allowToPatch(RestifyRequest $request, $payload = null): RestifyRepository
    {
        $this->adaptJsonApiRequest($request, true);

        return parent::allowToPatch($request, $payload);
    }

    public function getStoringRules(RestifyRequest $request): array
    {
        return $this->collectFields($request)->mapWithKeys(static fn (Field $k) => [
            ($k->label ?? $k->attribute) => $k->getStoringRules(),
        ])->toArray();
    }

    public function collectFields(RestifyRequest $request): FieldCollection
    {
        $fields = parent::collectFields($request);
        if ($request->isUpdateRequest()) {
            return $fields->map(static function (Field $field) {
                if (!($field instanceof BelongsTo)) {
                    // Fix to allow updating fields with custom labels
                    $field->label = $field->attribute;
                }

                return $field;
            });
        }

        return $fields;
    }

    /**
     * Adapt JSON:API request to Restify request.
     */
    protected function adaptJsonApiRequest(RestifyRequest $request, bool $snake_attributes = false): void
    {
        /** @var array<string, mixed> $attributes */
        $attributes = $request->input('data.attributes') ?? [];
        // Convert all keys to snake_case using Collections
        if ($snake_attributes) {
            $attributes = collect($attributes)
                ->mapWithKeys(static fn ($value, $key) => [Str::snake($key) => $value])
                ->toArray();
        }
        $relationships = $request->input('data.relationships') ?? [];

        /**Get relationships in this format:
         * One-To-One relationships (HasOne, BelongsTo): First type below
         * Many-To-Many relationships (HasMany, BelongsToMany): Second type below
         * @type array<string, string|int>|array<string, array<string, array<string|int, array<string>>> $relationship
         */
        $relationships = array_map(
            /**
             * @param array{
             *     data: array{type: string, id: int}|array{type: string, id: int}[]
             * } $relationship
             */
            static fn (array $relationship): int|array => Arr::get($relationship, 'data.id') ?? Arr::pluck($relationship['data'], 'pivots', 'id'),
            $relationships
        );
        $current_route = Route::current();
        $attach_route = Route::getRoutes()->getRoutesByMethod()['POST']['api/{repository}/{repositoryId}/attach/{relatedRepository}'];
        assert($attach_route instanceof \Illuminate\Routing\Route);
        $sync_route = Route::getRoutes()->getRoutesByMethod()['POST']['api/{repository}/{repositoryId}/sync/{relatedRepository}'];
        assert($sync_route instanceof \Illuminate\Routing\Route);

        foreach ($relationships as $relation_name => $pivots) {
            // Use sync request to remove current relationships
            $sync_body = [$relation_name => []];
            $sync_request = RepositorySyncRequest::create("{$request->getRequestUri()}/sync/$relation_name", 'POST', $sync_body, $request->cookie(), $request->allFiles(), $request->server(), Json::encode($sync_body));
            $sync_route->bind($sync_request);
            foreach ($current_route->parameters() as $name => $value) {
                $sync_route->setParameter($name, $value);
            }
            $sync_route->setParameter('relatedRepository', $relation_name);
            $sync_request->setRouteResolver(static fn () => $sync_route);
            $response = app(RepositorySyncController::class)($sync_request);
            if (!$response->isSuccessful()) {
                exit($response->send());
            }

            if (is_array($pivots)) {
                // Attach request relationships
                $attach_bodies = Arr::mapWithKeys($pivots, static fn ($pivots, $id) => [
                    $id => [
                    $relation_name => [$id],
                    ...($pivots ?? [])
                ]]);
                foreach ($attach_bodies as $attach_body) {
                    $attach_request = RepositoryAttachRequest::create("{$request->getRequestUri()}/attach/$relation_name", 'POST', $attach_body, $request->cookie(), $request->allFiles(), $request->server(), Json::encode($attach_body));
                    $attach_route->bind($attach_request);
                    foreach ($current_route->parameters() as $name => $value) {
                        $attach_route->setParameter($name, $value);
                    }
                    $attach_route->setParameter('relatedRepository', $relation_name);
                    $attach_request->setRouteResolver(static fn () => $attach_route);
                    $response = app(RepositoryAttachController::class)($attach_request);
                    if (!$response->isSuccessful()) {
                        exit($response->send());
                    }
                }
            }
        }

        $request->replace([
            ...$attributes,
            ...$relationships,
        ]);
    }

    public function resolveRelationships($request): array
    {
        return array_map(static fn ($data) => ['data' => $data], parent::resolveRelationships($request));
    }
}
