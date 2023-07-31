<?php

namespace App\Http\Controllers;

use App\Models\OnlineSale;
use App\Models\Sale;
use App\Models\ShopSale;
use App\Models\Tariff;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Inertia\Response;
use Inertia\ResponseFactory;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    public function home(): Response|ResponseFactory
    {
        //utils query
        $subQuery = Tariff::query()
            ->join('discounts', 'tariffs.discount_id', '=', 'discounts.id')
            ->select('tariffs.donut_id', 'tariffs.quantity', 'discounts.start_date', 'discounts.end_date', 'tariffs.percentage_discount');

        $sales_with_discount = Sale::query()
            ->join('purchases', 'purchases.sale_id', '=', 'sales.id')
            ->join('donuts', 'donuts.id', '=', 'purchases.donut_id')
            ->leftJoinSub($subQuery, 'tariffs_with_dates', function (JoinClause $join) {
                $join->on('donuts.id', '=', 'tariffs_with_dates.donut_id')
                    ->on('purchases.quantity', '>=', 'tariffs_with_dates.quantity')
                    ->on('sales.date', '>=', 'tariffs_with_dates.start_date')
                    ->on('sales.date', '<=', 'tariffs_with_dates.end_date');
            })
            ->select('sales.id')
            ->groupBy('sales.id', 'purchases.quantity', 'donuts.price');

        $sales_total_price_by_donut_type = $sales_with_discount
            ->addSelect(DB::raw('((100 - IF(MAX(tariffs_with_dates.percentage_discount) IS NULL, 0, MAX(tariffs_with_dates.percentage_discount)) )/100 * donuts.price * purchases.quantity) AS price_for_donut_type'));

        $sale_total = Sale::query()
            ->leftJoinSub($sales_total_price_by_donut_type, 'sales_total_price_by_donut_type', function (JoinClause $join) {
                $join->on('sales.id', '=', 'sales_total_price_by_donut_type.id');
            })
            ->select('sales.id', DB::raw('SUM(sales_total_price_by_donut_type.price_for_donut_type) AS total_price'))
            ->groupBy('sales.id');

        return inertia('Home', [
            'mostSoldDonuts' => Sale::query()
                ->join('purchases', 'purchases.sale_id', '=', 'sales.id')
                ->join('donuts', 'donuts.id', '=', 'purchases.donut_id')
                ->select(DB::raw('donuts.name, SUM(purchases.quantity) AS sales'))
                ->groupBy('donuts.name')
                ->orderBy('sales', 'desc')
                ->limit(3)
                ->get(),
            'salesProceeds' => [
                'online' => OnlineSale::query()
                        ->leftJoinSub($sale_total, 'sale_total', static function (JoinClause $join) {
                            $join->on('online_sales.sale_id', '=', 'sale_total.id');
                        })
                    ->select(DB::raw('SUM(sale_total.total_price) AS total_price'))
                    ->first('total_price')['total_price'] ?? 0,
                'inShop' => ShopSale::query()
                        ->leftJoinSub($sale_total, 'sale_total', static function (JoinClause $join) {
                            $join->on('shop_sales.sale_id', '=', 'sale_total.id');
                        })
                        ->select(DB::raw('SUM(sale_total.total_price) AS total_price'))
                    ->first('total_price')['total_price'] ?? 0,
            ],
            'shopsProceeds' => ShopSale::query()
                ->join('sales', 'sales.id', '=', 'shop_sales.sale_id')
                ->leftJoinSub($sale_total, 'sale_total', static function (JoinClause $join) {
                    $join->on('shop_sales.sale_id', '=', 'sale_total.id');
                })
                ->join('shops', 'sales.shop_id', '=', 'shops.id')
                ->groupBy(['sales.shop_id',  'shops.address'])
                ->select(DB::raw( /** @lang sql */ 'shops.address, SUM(sale_total.total_price) AS total_proceeds'))
                ->get(),
        ]);
    }
}
