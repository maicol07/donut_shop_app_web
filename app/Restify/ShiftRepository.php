<?php

namespace App\Restify;

use App\Models\Shift;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class ShiftRepository extends Repository
{
    public static string $model = Shift::class;
    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('week_day')->required()->rules("string", "in:monday, tuesday, wednesday, thursday, friday, saturday, sunday"),
            field('start_time')->required()->rules("date"),
            field('end_time')->required()->rules("date"),
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
