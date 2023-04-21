<?php

namespace App\Restify;

use App\Models\Tariff;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class TariffRepository extends Repository
{
    public static string $model = Tariff::class;
    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('discount_id')->required()->rules("string"),
            field('donut_id')->required()->rules("string"),
            field('quantity')->required()->rules("string", "numeric"),
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
