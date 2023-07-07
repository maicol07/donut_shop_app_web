<?php

namespace App\Restify;

use App\Models\Supply;
use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class SupplyRepository extends Repository
{
    public static string $model = Supply::class;

    public static bool|array $public = true;

    public function fields(RestifyRequest $request): array
    {
        return [
            field('start_date')->label('startDate')->required()->rules('date'),
            field('end_date')->label('endDate')->required()->rules('date'),
            field('updated_at')->readonly(),
            field('created_at')->readonly(),

            BelongsTo::make('company', CompanyRepository::class),
        ];
    }

    public static function related(): array
    {
        return [
            BelongsTo::make('company', CompanyRepository::class),
            BelongsToMany::make('donuts', DonutRepository::class)->withPivot(
                field('quantity')->required()->rules('numeric'),
                field('created_at')->readonly(),
                field('updated_at')->readonly(),
            ),
        ];
    }
}
