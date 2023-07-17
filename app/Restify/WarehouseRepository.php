<?php

namespace App\Restify;

use App\Models\Warehouse;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class WarehouseRepository extends Repository
{
    public static string $model = Warehouse::class;

    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('name')->required()->rules('string'),
            field('address')->required()->rules('string'),
            field('created_at')->label('createdAt')->readonly(),
            field('updated_at')->label('updatedAt')->readonly(),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsToMany::make('shops', ShopRepository::class)->withPivot(
                field('created_at')->label('createdAt')->readonly(),
                field('updated_at')->label('updatedAt')->readonly(),
            ),
            BelongsToMany::make('ingredients', IngredientRepository::class)->withPivot(
                field('quantity')->required()->rules('numeric'),
                field('created_at')->label('createdAt')->readonly(),
                field('updated_at')->label('updatedAt')->readonly(),
            ),
        ];
    }
}
