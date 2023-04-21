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
            field('address')->required()->rules("string"),
            field("updated_at")->readonly(),
            field("created_at")->readonly()
        ];
    }

    public static function related(): array
    {
        return [
            BelongsToMany::make('employees', EmployeeRepository::class)->withPivot(
                field("fiscal_code"),
                field("created_at"),
                field("updated_at"),
            ),
            BelongsToMany::make('contracts', ContractRepository::class)->withPivot(
                field("created_at"),
                field("updated_at"),
            ),
            BelongsToMany::make('availabilities', DonutRepository::class)->withPivot(
                field("quantity"),
                field("created_at"),
                field("updated_at"),
            ),
            BelongsToMany::make('warehouses', WarehouseRepository::class)->withPivot(
                field("created_at"),
                field("updated_at"),
            ),
        ];
    }
}
