<?php

namespace App\Restify;

use App\Models\Shop;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class ShopRepository extends Repository
{
    public static string $model = Shop::class;

    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('address')->required()->rules('string'),
            field('updated_at')->label('createdAt')->readonly(),
            field('created_at')->label('updatedAt')->readonly(),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsToMany::make('employees', EmployeeRepository::class)->withPivot(
                field('fiscal_code')->required()->rules('string'),
                field('created_at')->label('createdAt')->readonly(),
                field('updated_at')->label('updatedAt')->readonly(),
            ),
            BelongsToMany::make('contracts', ContractRepository::class)->withPivot(
                field('created_at')->label('createdAt')->readonly(),
                field('updated_at')->label('updatedAt')->readonly(),
            ),
            BelongsToMany::make('donuts', DonutRepository::class)->withPivot(
                field('quantity')->required()->rules('numeric'),
            ),
            BelongsToMany::make('warehouses', WarehouseRepository::class),
        ];
    }
}
