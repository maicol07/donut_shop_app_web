<?php

namespace App\Restify;

use App\Models\Sale;
use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Fields\HasOne;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class SaleRepository extends Repository
{
    public static string $model = Sale::class;

    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('date')->required()->rules('date'),
            field('shop_id')->rules(['nullable', 'numeric']),
            field('created_at')->label('createdAt')->readonly(),
            field('updated_at')->label('updatedAt')->readonly(),

            BelongsTo::make('shop', ShopRepository::class),
            BelongsTo::make('supply', SupplyRepository::class),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsTo::make('shop', ShopRepository::class),
            BelongsTo::make('supply', SupplyRepository::class),
            HasOne::make('onlineSale', OnlineSaleRepository::class),
            BelongsToMany::make('donuts', DonutRepository::class)->withPivot(
                field('quantity')->required()->rules('numeric')
            ),
        ];
    }
}
