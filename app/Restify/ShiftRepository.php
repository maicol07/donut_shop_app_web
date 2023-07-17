<?php

namespace App\Restify;

use App\Models\Shift;
use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class ShiftRepository extends Repository
{
    public static string $model = Shift::class;

    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('week_day')->label('weekDay')->required()->rules('string'),
            field('start_time')->label('startTime')->required(),
            field('end_time')->label('endTime')->required(),
            field('created_at')->label('createdAt')->readonly(),
            field('updated_at')->label('updatedAt')->readonly(),

            BelongsTo::make('contract', ContractRepository::class),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsTo::make('contract', ContractRepository::class),
        ];
    }
}
