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
            field('start_date')->required()->rules("date"),
            field('end_date')->required()->rules("date"),
            field('company_vat_number')->required()->rules("string"),
            field("updated_at")->readonly(),
            field("created_at")->readonly()
        ];
    }
    public static function related(): array
    {
        return [
            BelongsTo::make('company', CompanyRepository::class),
            BelongsToMany::make('dailyReservation', DonutRepository::class)->withPivot(
                field("quantity"),
                field("created_at"),
                field("updated_at"),
            ),
        ];
    }
}
