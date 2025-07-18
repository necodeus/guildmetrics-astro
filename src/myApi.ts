/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface HandlersAchievementResponse {
  category?: string;
  description?: string;
  imageURL?: string;
  order?: number;
  title?: string;
  unlockAtVal?: number;
  uuid?: string;
}

export interface HandlersAchievementsHandlerResponse {
  achievements?: HandlersAchievementResponse[];
}

export interface HandlersCombinedCalendarResponse {
  calendar?: HandlersNestedCalendar;
  github_calendar?: HandlersNestedCalendar;
  handles?: Record<string, string>;
}

export interface HandlersCourseResponse {
  authorUUIDs?: string[];
  description?: string;
  estimatedCompletionTimeHours?: number;
  genericTitle?: string;
  language?: string;
  shortDescription?: string;
  slug?: string;
  status?: string;
  thumbnailURL?: string;
  title?: string;
  typeDescription?: string;
  uuid?: string;
}

export interface HandlersCoursesHandlerResponse {
  courses?: HandlersCourseResponse[];
  users?: HandlersUserWithCoursesResponse[];
}

export interface HandlersIndexResponse {
  achievements?: HandlersAchievementResponse[];
  courses?: HandlersCourseResponse[];
  organizations?: HandlersOrganizationResponse[];
  users?: HandlersIndexUserResponse[];
}

export interface HandlersIndexUserResponse {
  firstName?: string;
  gems?: number;
  handle?: string;
  lastName?: string;
  lessonsCompleted?: number;
  level?: number;
  profileImageURL?: string;
  role?: string;
  userAchievements?: HandlersUserAchievementResponse[];
  userCourses?: HandlersUserCourseResponse[];
  xp?: number;
  xpForLevel?: number;
  xpTotalForLevel?: number;
}

export type HandlersNestedCalendar = Record<
  string,
  Record<string, Record<string, number>>
>;

export interface HandlersOrganizationResponse {
  createdAt?: string;
  expiresAt?: string;
  handle?: string;
  name?: string;
  numTotalSeats?: number;
  numUsedSeats?: number;
}

export interface HandlersUserAchievementResponse {
  UUID?: string;
  unlockedAt?: string;
}

export interface HandlersUserCourseResponse {
  completedAt?: string;
  uuid?: string;
}

export interface HandlersUserHandlerResponse {
  user?: HandlersUserUserResponse;
}

export interface HandlersUserUserResponse {
  firstName?: string;
  gems?: number;
  handle?: string;
  lastName?: string;
  lessonsCompleted?: number;
  level?: number;
  profileImageURL?: string;
  role?: string;
  userAchievements?: HandlersUserAchievementResponse[];
  userCourses?: HandlersUserCourseResponse[];
  xp?: number;
  xpForLevel?: number;
  xpTotalForLevel?: number;
}

export interface HandlersUserWithCoursesResponse {
  courses?: HandlersUserCourseResponse[];
  handle?: string;
  id?: string;
  name?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "/";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      (key) => "undefined" !== typeof query[key],
    );
    return keys
      .map((key) =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key),
      )
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string")
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== "string"
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
              ? JSON.stringify(property)
              : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams,
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken,
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { "Content-Type": type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === "undefined" || body === null
            ? null
            : payloadFormatter(body),
      },
    ).then(async (response) => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title GuildMetrics API
 * @version 1
 * @baseUrl /
 * @contact
 *
 * This is the API for GuildMetrics
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  achievements = {
    /**
     * @description Get all achievements
     *
     * @tags achievements
     * @name AchievementsList
     * @summary Get all achievements
     * @request GET:/achievements
     */
    achievementsList: (params: RequestParams = {}) =>
      this.request<HandlersAchievementsHandlerResponse[], any>({
        path: `/achievements`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  calendar = {
    /**
     * @description Get calendar data
     *
     * @tags calendar
     * @name CalendarList
     * @summary Get calendar data
     * @request GET:/calendar
     */
    calendarList: (params: RequestParams = {}) =>
      this.request<HandlersCombinedCalendarResponse[], any>({
        path: `/calendar`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  courses = {
    /**
     * @description Get all courses
     *
     * @tags courses
     * @name CoursesList
     * @summary Get all courses
     * @request GET:/courses
     */
    coursesList: (params: RequestParams = {}) =>
      this.request<HandlersCoursesHandlerResponse[], any>({
        path: `/courses`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  index = {
    /**
     * @description Get all data for the index page
     *
     * @tags index
     * @name IndexList
     * @summary Get all data for the index page
     * @request GET:/index
     */
    indexList: (params: RequestParams = {}) =>
      this.request<HandlersIndexResponse, any>({
        path: `/index`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  user = {
    /**
     * @description Get user data
     *
     * @tags user
     * @name UserDetail
     * @summary Get user data
     * @request GET:/user/{handle}
     */
    userDetail: (handle: string, params: RequestParams = {}) =>
      this.request<HandlersUserHandlerResponse, any>({
        path: `/user/${handle}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
