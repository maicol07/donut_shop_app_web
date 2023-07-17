<?php

namespace App\Restify;

use App\Models\Tariff;
use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class TariffRepository extends Repository
{
    public static string $model = Tariff::class;

    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('quantity')->required()->rules(['numeric']),
            field('percentage_discount')->label('percentageDiscount')->required()->rules(['numeric']),
            field('created_at')->label('createdAt')->readonly(),
            field('updated_at')->label('updatedAt')->readonly(),

            BelongsTo::make('donut', DonutRepository::class),
            BelongsTo::make('discount', DiscountRepository::class),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsTo::make('donut', DonutRepository::class),
            BelongsTo::make('discount', DiscountRepository::class),
        ];
    }
}
