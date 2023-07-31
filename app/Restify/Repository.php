<?php

namespace App\Restify;

use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Fields\Field;
use Binaryk\LaravelRestify\Fields\FieldCollection;
use Binaryk\LaravelRestify\Filters\Filter;
use Binaryk\LaravelRestify\Filters\MatchFilter;
use Binaryk\LaravelRestify\Http\Controllers\RepositoryAttachController;
use Binaryk\LaravelRestify\Http\Controllers\RepositorySyncController;
use Binaryk\LaravelRestify\Http\Requests\RepositoryAttachRequest;
use Binaryk\LaravelRestify\Http\Requests\RepositorySyncRequest;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;
use Binaryk\LaravelRestify\Repositories\Repository as RestifyRepository;
use Carbon\Exceptions\InvalidFormatException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Nette\Utils\Json;
use function assert;
use function in_array;
use function is_array;

abstract class Repository extends RestifyRepository
{
    public static array $sort = ['id'];

    public static array $match = ['id'];

    public static function matches(): array
    {
        return array_map(static fn (string $type): Filter => MatchFilter::make()->setType($type)->partial(), static::$match);
    }

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
        /** @psalm-suppress InvalidArrayOffset */
        return $this->collectFields($request)->mapWithKeys(static fn (Field $k) => [
            ($k->label ?? $k->attribute) => $k->getStoringRules(),
        ])->toArray();
    }

    public function collectFields(RestifyRequest $request): FieldCollection
    {
        $fields = parent::collectFields($request);
        if ($request->isUpdateRequest()) {
            return $fields->map(static function (Field $field) {
                if (! ($field instanceof BelongsTo)) {
                    // Fix to allow updating fields with custom labels
                    $field->label = $field->attribute;
                }

                return $field;
            });
        }

        return $fields;
    }

    /**
     * Return a list with relationship for the current model.
     *
     * @param  RestifyRequest  $request
     */
    public function resolveRelationships($request): array
    {
        return Arr::whereNotNull(Arr::map(parent::resolveRelationships($request), static function (self|Collection|null $repository) use ($request) {
            if ($repository instanceof self) {
                return [
                    'data' => [
                        'id' => $repository->getId($request),
                        'type' => $repository->getType($request),
                        'pivots' => $repository->resolveShowPivots($request),
                    ],
                    'included' => $repository,
                ];
            }

            if ($repository instanceof Collection && $repository->isNotEmpty()) {
                return [
                    'data' => $repository->map(static fn (self $repository) => [
                        'id' => $repository->getId($request),
                        'type' => $repository->getType($request),
                        'pivots' => $repository->resolveShowPivots($request),
                    ]),
                    'included' => $repository,
                ];
            }

            return null;
        }));
    }

    public function index(RestifyRequest $request): JsonResponse
    {
        $response = parent::index($request);
        $data = $response->getData(true);

        $included = Arr::collapse(Arr::pluck($data['data'], 'relationships.*.included'));
        $included = array_filter($included);

        foreach ($included as $value) {
            // Extract included from relationships and sub relationships)
            do {
                $original = $value;
                $value = Arr::collapse(Arr::pluck($value, 'relationships.*.included'));
                $value = Arr::collapse(array_filter($value));
                if (empty($value)) {
                    $value = array_filter(Arr::collapse(Arr::pluck($original, '*.included')));
                }
                if (isset($value['id'])) {
                    $value = [$value];
                }
                $included = [...$included, ...$value];
            } while ($value);
        }

        // Merge all included
        foreach ($included as $key => &$value) {
            $this->mergeIncludedRelationships($value, $key, $included);
        }
        unset($value);

        // Remove duplicates with same id (nested array)
        $ids = [];
        foreach ($included as $key => $value) {
            if (in_array($value['id'], $ids[$value['type']] ?? [], true)) {
                unset($included[$key]);
            } else {
                $ids[$value['type']][] = $value['id'];
            }
        }

        // Remove pivot from included
        foreach ($included as &$item) {
            Arr::forget($item, 'pivots');
        }
        unset($item);

        $data['included'] = array_values($included);

        // Remove included from relationships (we already have them in included)
        foreach ($data['data'] as &$item) {
            if (isset($item['relationships'])) {
                foreach ($item['relationships'] as &$relationship) {
                    Arr::forget($relationship, 'included');
                }
            }
        }

        return $response->setData($data);
    }

    public function mergeIncludedRelationships(array $value, string|int $key, array &$parent): void
    {
        if (is_array($value[0] ?? null)) {
            foreach ($value as $k => $v) {
                $this->mergeIncludedRelationships($v, $k, $value);
            }
            unset($parent[$key]);
            $parent = [...$parent, ...$value];
        }
    }

    public function extractIncluded(array $resource, array &$included)
    {
        $inc = Arr::pluck($resource, 'included');
        if ($inc) {
            $included = [...$included, ...array_filter($inc)];
            foreach ($inc as $key => $value) {
                $rel_nested = Arr::get($value, 'relationships', []);
                $this->extractIncluded($rel_nested, $included);
            }
        }
    }

    public function show(RestifyRequest $request, $repositoryId): JsonResponse
    {
        $response = parent::show($request, $repositoryId);
        $data = $response->getData(true);

        $rel = Arr::get($data, 'data.relationships');

        if ($rel) {
            $included = [];
            // Extract included from relationships and sub relationships (recursive)
            $this->extractIncluded($rel, $included);
            //            $included = array_filter(Arr::pluck($rel, 'included'));
            // Merge all included
            foreach ($included as $key => &$value) {
                $this->mergeIncludedRelationships($value, $key, $included);
            }
            unset($value);

            // Remove pivots from included
            foreach ($included as &$value) {
                Arr::forget($value, 'pivots');
            }
            unset($value);

            // Remove nested included from included
            foreach ($included as $key => &$value) {
                foreach ($value['relationships'] ?? [] as $k => $v) {
                    Arr::forget($included, "$key.relationships.$k.included");
                    Arr::forget($included, "$key.relationships.$k.data.pivots");
                }
            }
            unset($value);

            /**
             * @return array|RestifyRepository|Collection|null
             */
            $data['included'] = array_values($included);
        }

        // Remove included from relationships (we already have them in included)
        foreach (($data['data']['relationships'] ?? []) as &$relationship) {
            Arr::forget($relationship, 'included');
        }

        return $response->setData($data);
    }

    /**
     * Adapt JSON:API request to Restify request.
     *
     * @psalm-suppress all
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
            static fn (array $relationship): string|int|array => Arr::get($relationship, 'data.id') ?? Arr::pluck($relationship['data'], 'pivots', 'id'),
            $relationships
        );
        $routes = Route::getRoutes()->getRoutesByMethod()['POST'];
        $current_route = Route::current();
        $base = trim(config('restify.base'), '/');
        $attach_route = $routes[$base.'/{repository}/{repositoryId}/attach/{relatedRepository}'];
        assert($attach_route instanceof \Illuminate\Routing\Route);
        $sync_route = $routes[$base.'/{repository}/{repositoryId}/sync/{relatedRepository}'];
        assert($sync_route instanceof \Illuminate\Routing\Route);

        foreach ($relationships as $relation_name => $pivots) {
            if (is_array($pivots)) {
                // Use sync request to remove current relationships
                /** @psalm-suppress InvalidArrayOffset */
                $sync_body = [$relation_name => []];
                $sync_request = RepositorySyncRequest::create(
                    "{$request->getRequestUri()}/sync/$relation_name",
                    'POST',
                    $sync_body,
                    $request->cookie(),
                    $request->allFiles(),
                    $request->server(),
                    Json::encode($sync_body)
                );
                $sync_route->bind($sync_request);
                foreach ($current_route->parameters() as $name => $value) {
                    $sync_route->setParameter($name, $value);
                }
                $sync_route->setParameter('relatedRepository', $relation_name);
                $sync_request->setRouteResolver(static fn () => $sync_route);
                $response = app(RepositorySyncController::class)($sync_request);
                if (! $response->isSuccessful()) {
                    exit($response->send());
                }
                // Attach request relationships
                $attach_bodies = Arr::mapWithKeys($pivots, static fn ($pivots, $id) => [
                    $id => [
                        $relation_name => [$id],
                        ...($pivots ?? []),
                    ]]);
                foreach ($attach_bodies as $attach_body) {
                    $attach_request = RepositoryAttachRequest::create(
                        "{$request->getRequestUri()}/attach/$relation_name",
                        'POST',
                        $attach_body,
                        $request->cookie(),
                        $request->allFiles(),
                        $request->server(),
                        Json::encode($attach_body)
                    );
                    $attach_route->bind($attach_request);
                    foreach ($current_route->parameters() as $name => $value) {
                        $attach_route->setParameter($name, $value);
                    }
                    $attach_route->setParameter('relatedRepository', $relation_name);
                    $attach_request->setRouteResolver(static fn () => $attach_route);
                    $response = app(RepositoryAttachController::class)($attach_request);
                    if (! $response->isSuccessful()) {
                        exit($response->send());
                    }
                }
            }
        }

        // Fix dates (JSONAPI uses ISO 8601, DB uses Y-m-d H:i:s)
        $attributes = array_map(
            static function ($value) {
                if (is_string($value) && Carbon::hasFormat($value, 'Y-m-d\TH:i:sP')) {
                    try {
                        return Carbon::parse($value)->format('Y-m-d H:i:s');
                    } catch (InvalidFormatException) {
                        return $value;
                    }
                }

                return $value;
            },
            $attributes
        );

        $request->replace([
            ...$attributes,
            ...$relationships,
        ]);
    }
}
