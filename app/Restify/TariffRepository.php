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
//            field('discount_id')->label('discountId')->required()->rules("string"),
//            field('donut_id')->label('donutId')->required()->rules("string"),
            field('quantity')->required()->rules("string", "numeric"),
            field("updated_at")->readonly(),
            field("created_at")->readonly()
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
