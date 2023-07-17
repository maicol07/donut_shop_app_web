<?php

namespace App\Restify;

use App\Models\Discount;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class DiscountRepository extends Repository
{
    public static string $model = Discount::class;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('discount_name')->label('discountName')->required()->rules('string'),
            field('start_date')->label('startDate')->required()->rules('date'),
            field('end_date')->label('endDate')->required()->rules('date'),
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
        ];
    }
}
