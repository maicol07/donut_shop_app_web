<?php

namespace App\Restify;

use App\Models\Contract;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Fields\HasMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class ContractRepository extends Repository
{
    public static string $model = Contract::class;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('salary')->required()->rules('numeric'),
            field('start_date')->label('startDate')->required()->rules('date'),
            field('end_date')->label('endDate')->required()->rules('date'),
            field('type')->required()->rules('string'),
            field("created_at")->label('createdAt')->readonly(),
            field("updated_at")->label('updatedAt')->readonly()
        ];
    }

    public static function related(): array
    {
        return [
            HasMany::make('shifts'),
            BelongsToMany::make('employee'),
            BelongsToMany::make('shops')
        ];
    }
}
