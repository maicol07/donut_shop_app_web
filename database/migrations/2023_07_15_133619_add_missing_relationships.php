<?php /** @noinspection UnusedFunctionResultInspection */

use App\Models\Account;
use App\Models\Company;
use App\Models\Contract;
use App\Models\Customer;
use App\Models\Discount;
use App\Models\Donut;
use App\Models\Employee;
use App\Models\Ingredient;
use App\Models\Sale;
use App\Models\Shop;
use App\Models\Supply;
use App\Models\Warehouse;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accounts', static function (Blueprint $table) {
            $table->foreign('fiscal_code')->references(app(Customer::class)->getKeyName())->on(app(Customer::class)->getTable())
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
        });

        Schema::table('availabilities', static function (Blueprint $table) {
            $table->foreignIdFor(Donut::class)->change()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Shop::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('compositions', static function (Blueprint $table) {
            $table->foreignIdFor(Donut::class)->change()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Ingredient::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('customers', static function (Blueprint $table) {
            $table->foreign('vat_number')->references(app(Company::class)->getKeyName())->on(app(Company::class)->getTable())->cascadeOnUpdate()->cascadeOnDelete();
        });

        Schema::table('daily_reservations', static function (Blueprint $table) {
            $table->foreignIdFor(Donut::class)->change()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Supply::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('employee_assignments', static function (Blueprint $table) {
            $table->foreignIdFor(Contract::class)->change()->constrained()->cascadeOnDelete();
            $table->foreign('fiscal_code')->references('fiscal_code')->on(app(Employee::class)->getTable())->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignIdFor(Shop::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('online_sales', static function (Blueprint $table) {
            $table->foreignIdFor(Sale::class)->change()->constrained()->cascadeOnDelete();
            $table->foreign('username')->references(app(Account::class)->getKeyName())->on(app(Account::class)->getTable())->cascadeOnUpdate()->cascadeOnDelete();
        });

        Schema::table('purchases', static function (Blueprint $table) {
            $table->foreignIdFor(Sale::class)->change()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Donut::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('sales', static function (Blueprint $table) {
            $table->foreignIdFor(Shop::class)->change()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Supply::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('shifts', static function (Blueprint $table) {
            $table->foreignIdFor(Contract::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('shop_sales', static function (Blueprint $table) {
            $table->foreignIdFor(Sale::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('stocks', static function (Blueprint $table) {
            $table->foreignIdFor(Warehouse::class)->change()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Shop::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('storages', static function (Blueprint $table) {
            $table->foreignIdFor(Warehouse::class)->change()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Ingredient::class)->change()->constrained()->cascadeOnDelete();
        });

        Schema::table('supplies', static function (Blueprint $table) {
            $table->foreign('company_vat_number')->references(app(Company::class)->getKeyName())->on(app(Company::class)->getTable())->cascadeOnUpdate()->cascadeOnDelete();
        });

        Schema::table('tariffs', static function (Blueprint $table) {
            $table->foreignIdFor(Discount::class)->change()->constrained()->cascadeOnDelete();
            $table->foreignIdFor(Donut::class)->change()->constrained()->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('accounts', static function (Blueprint $table) {
            $table->dropForeign(['fiscal_code']);
        });

        Schema::table('availabilities', static function (Blueprint $table) {
            $table->dropForeign(['donut_id']);
            $table->dropForeign(['shop_id']);
        });

        Schema::table('compositions', static function (Blueprint $table) {
            $table->dropForeign(['donut_id']);
            $table->dropForeign(['ingredient_id']);
        });

        Schema::table('customers', static function (Blueprint $table) {
            $table->dropForeign(['vat_number']);
        });

        Schema::table('daily_reservations', static function (Blueprint $table) {
            $table->dropForeign(['donut_id']);
            $table->dropForeign(['supply_id']);
        });

        Schema::table('employee_assignments', static function (Blueprint $table) {
            $table->dropForeign(['contract_id']);
            $table->dropForeign(['fiscal_code']);
            $table->dropForeign(['shop_id']);
        });

        Schema::table('online_sales', static function (Blueprint $table) {
            $table->dropForeign(['sale_id']);
            $table->dropForeign(['username']);
        });

        Schema::table('purchases', static function (Blueprint $table) {
            $table->dropForeign(['sale_id']);
            $table->dropForeign(['donut_id']);
        });

        Schema::table('sales', static function (Blueprint $table) {
            $table->dropForeign(['shop_id']);
            $table->dropForeign(['supply_id']);
        });

        Schema::table('shifts', static function (Blueprint $table) {
            $table->dropForeign(['contract_id']);
        });

        Schema::table('shop_sales', static function (Blueprint $table) {
            $table->dropForeign(['sale_id']);
        });

        Schema::table('stocks', static function (Blueprint $table) {
            $table->dropForeign(['warehouse_id']);
            $table->dropForeign(['shop_id']);
        });

        Schema::table('storages', static function (Blueprint $table) {
            $table->dropForeign(['warehouse_id']);
            $table->dropForeign(['ingredient_id']);
        });

        Schema::table('supplies', static function (Blueprint $table) {
            $table->dropForeign(['company_vat_number']);
        });

        Schema::table('tariffs', static function (Blueprint $table) {
            $table->dropForeign(['discount_id']);
            $table->dropForeign(['donut_id']);
        });
    }
};
