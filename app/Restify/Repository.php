<?php /** @noinspection MissingParentCallInspection */

namespace App\Restify;

use Binaryk\LaravelRestify\Http\Requests\RestifyRequest;
use Binaryk\LaravelRestify\Repositories\Repository as RestifyRepository;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Http\Request;

abstract class Repository extends RestifyRepository
{

    /**
     * Build a "show" and "index" query for the given repository.
     */
     public static function mainQuery(RestifyRequest $request, Builder|Relation $query): Builder
     {
         return $query;
     }

    /**
     * Build an "index" query for the given repository.
     */
    public static function indexQuery(RestifyRequest $request, Builder|Relation $query): Builder
    {
        return $query;
    }

    /**
     * Build a "show" query for the given repository.
     */
    public static function showQuery(RestifyRequest $request, Builder|Relation $query): Builder
    {
        return $query;
    }

    public static function authorizedToStore(Request $request): bool
    {
        return true;
    }

    public function authorizedTo(Request $request, iterable|string $ability): bool
    {
        return true;
    }

    public static function authorizedToUseRepository(Request $request): bool
    {
        return true;
    }

    public static function authorizedToStoreBulk(Request $request): bool
    {
        return true;
    }

    public static function authorizedToUseRoute(Request $request): bool
    {
        return true;
    }

}
