<?php

namespace App\Restify;

use App\Models\Ingredient;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class IngredientRepository extends Repository
{
    public static string $model = Ingredient::class;

    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('name')->required(),
            field('allergen')->required()->rules('boolean'),
            field('created_at')->label('createdAt')->readonly(),
            field('updated_at')->label('updatedAt')->readonly(),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsToMany::make('donuts')->withPivot(
                field('absolute_quantity')->required()->rules('numeric'),
                field('created_at')->label('createdAt')->readonly(),
                field('updated_at')->label('updatedAt')->readonly(),
            ),
            BelongsToMany::make('warehouses')->withPivot(
                field('quantity')->required()->rules('numeric'),
                field('created_at')->label('createdAt')->readonly(),
                field('updated_at')->label('updatedAt')->readonly(),
            ),
        ];
    }
}
