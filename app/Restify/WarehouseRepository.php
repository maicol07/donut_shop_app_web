<?php

namespace App\Restify;

use App\Models\Warehouse;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class WarehouseRepository extends Repository
{
    public static string $model = Warehouse::class;
    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('name')->required()->rules("string"),
            field('allergen')->required()->rules("boolean"),
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
