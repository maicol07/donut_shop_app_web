<?php

namespace App\Restify;

use App\Models\ShopSale;
use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class ShopSaleRepository extends Repository
{
    public static string $model = ShopSale::class;
    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('name')->required()->rules("string"),
            field('address')->required()->rules("string"),
            field("updated_at")->readonly(),
            field("created_at")->readonly()
        ];
    }

    public static function related(): array
    {
        return [
            BelongsTo::make('sale', SaleRepository::class),
        ];
    }
}
