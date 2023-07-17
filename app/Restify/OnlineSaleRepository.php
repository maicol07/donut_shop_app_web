<?php

namespace App\Restify;

use App\Models\OnlineSale;
use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class OnlineSaleRepository extends Repository
{
    public static string $model = OnlineSale::class;

    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('type')->required()->rules('string'),
            field('created_at')->label('createdAt')->readonly(),
            field('updated_at')->label('updatedAt')->readonly(),

            BelongsTo::make('account', AccountRepository::class),
            BelongsTo::make('sale', SaleRepository::class),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsTo::make('account', AccountRepository::class),
            BelongsTo::make('sale', SaleRepository::class),
        ];
    }
}
