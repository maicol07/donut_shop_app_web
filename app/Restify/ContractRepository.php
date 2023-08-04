<?php

namespace App\Restify;

use App\Models\Contract;
use App\Models\Employee;
use Binaryk\LaravelRestify\Fields\BelongsToMany;
use Binaryk\LaravelRestify\Fields\HasMany;
use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

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
            field('created_at')->label('createdAt')->readonly(),
            field('updated_at')->label('updatedAt')->readonly(),
        ];
    }

    public static function related(): array
    {
        return [
            HasMany::make('shifts', ShiftRepository::class),
            BelongsToMany::make('employee', EmployeeRepository::class)
                ->required()
                ->attachCallback(static fn (RestifyRequest $request, self $repository, Contract $contract) => $repository->attachAssignment($request, $repository, $contract))
                ->detachCallback(static fn (RestifyRequest $request, self $repository, Contract $contract) => $repository->attachAssignment($request, $repository, $contract)),
            BelongsToMany::make('shops', ShopRepository::class)
                ->required()
                ->attachCallback(static fn (RestifyRequest $request, self $repository, Contract $contract) => $repository->attachAssignment($request, $repository, $contract))
                ->detachCallback(static fn (RestifyRequest $request, self $repository, Contract $contract) => $repository->attachAssignment($request, $repository, $contract)),
        ];
    }

    private function attachAssignment(RestifyRequest $request, self $repository, Contract $contract): JsonResponse
    {
        [$employee_fiscal_code, $shop_id] = $this->getEmployeeShopFromRequest($request);

        if ($shop_id && $employee_fiscal_code) {
            DB::table('employee_assignments')->updateOrInsert([
                'contract_id' => $contract->id,
                'shop_id' => $shop_id,
                'fiscal_code' => $employee_fiscal_code,
            ]);
        }

        return data([], 201);
    }

    private function detachAssignment(RestifyRequest $request, self $repository, Contract $contract): JsonResponse
    {
        [$employee_fiscal_code, $shop_id] = $this->getEmployeeShopFromRequest($request);

        if ($shop_id && $employee_fiscal_code) {
            DB::table('employee_assignments')->where([
                'contract_id' => $contract->id,
                'shop_id' => $shop_id,
                'fiscal_code' => $employee_fiscal_code,
            ])->delete();
            return data([], 201);
        }

        $errors = [];
        if (!$shop_id) {
            $errors['shop'] = [
                'The shop field is required.'
            ];
        }

        if (!$employee_fiscal_code) {
            $errors['fiscalCode'] = [
                'The employee_fiscalCode field is required.'
            ];
        }

        return response()->json([
            'response' => compact('errors')
        ], 500);


    }

    private function getEmployeeShopFromRequest(RestifyRequest $request): array
    {
        $employee_fiscal_code = null;
        $employee_id = $request->input('employee')[0] ?? null;
        if ($employee_id) {
            $employee_fiscal_code = Employee::find($employee_id)->fiscal_code;
            $shop_id = $request->input('shop_id');
        } else {
            $shop_id = $request->input('shops')[0] ?? null;
            if ($shop_id) {
                $employee_fiscal_code = $request->input('employee_fiscalCode');
            }
        }

        return [$employee_fiscal_code, $shop_id];
    }
}
