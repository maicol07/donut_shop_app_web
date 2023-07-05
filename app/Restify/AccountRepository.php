<?php

namespace App\Restify;

use App\Models\Account;
use Binaryk\LaravelRestify\Fields\BelongsTo;
use Binaryk\LaravelRestify\Fields\HasMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;

class AccountRepository extends Repository
{
    public static string $model = Account::class;

    public static string $id = 'username';
    public static string $keyType = 'string';

    public function fields(RestifyRequest $request): array
    {
        return [
            field('username')->required()->rules('string')->storingRules('unique:accounts,username'),
            field('fiscal_code')->label("fiscalCode")->required()->rules('string')->storingRules('unique:accounts,fiscal_code'),
            field('password')->required()->rules(['string', 'min:8']),
            field("created_at")->label("createdAt")->readonly(),
            field("updated_at")->label("updatedAt")->readonly(),

            BelongsTo::make('customer')
        ];
    }

    public static function related(): array
    {
        return [
            BelongsTo::make('customer'),
            HasMany::make('onlineSales')
        ];
    }
}
