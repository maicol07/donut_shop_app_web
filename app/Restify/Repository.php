<?php /** @noinspection MissingParentCallInspection */

namespace App\Restify;

use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Fields\Field;
use Binaryk\LaravelRestify\Fields\FieldCollection;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;
use Binaryk\LaravelRestify\Repositories\Repository as RestifyRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

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

        // Get relationships in form of "relationshipName" → relationship_id
        $relationships = array_map(static fn (array $relationship): int => Arr::get($relationship, 'data.id'), $relationships);

        $request->replace([
            ...$attributes,
            ...$relationships,
        ]);
    }
}
