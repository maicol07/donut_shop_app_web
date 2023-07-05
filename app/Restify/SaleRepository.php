<?php

namespace App\Restify;

use App\Models\Sale;
use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Fields\HasOne;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class SaleRepository extends Repository
{
    public static string $model = Sale::class;
    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('date')->required()->rules("date"),
            field("updated_at")->readonly(),
            field("created_at")->readonly(),

            BelongsTo::make('shop', ShopRepository::class),
            BelongsTo::make('supply', SupplyRepository::class)
        ];
    }

    public static function related(): array
    {
        return [
            BelongsTo::make('shop', ShopRepository::class),
            BelongsTo::make('supply', SupplyRepository::class),
            HasOne::make('onlineSale', OnlineSaleRepository::class)
        ];
    }
}
