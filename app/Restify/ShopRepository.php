<?php

namespace App\Restify;

use App\Models\Shop;
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
            //BelongsToMany::make('users', UserRepository::class),
        ];
    }
}
