<?php

namespace App\Restify;

use App\Models\Sale;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class SaleRepository extends Repository
{
    public static string $model = Sale::class;
    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('date')->required()->rules("date"),
            field('shop_id')->required()->rules("string"),
            field('supply_id')->required()->rules("string"),
            field("updated_at")->readonly(),
            field("created_at")->readonly()
        ];
    }

    public static function related(): array
    {
        return [
            //BelongsToMany::make('users', UserRepository::class),
        ];
    }
}
