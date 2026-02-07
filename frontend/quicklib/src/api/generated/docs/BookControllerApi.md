# BookControllerApi

All URIs are relative to *http://api.chirico.no/quicklib*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addBook**](#addbook) | **POST** /books | Add a new book|
|[**deleteBook**](#deletebook) | **DELETE** /books/{id} | Delete a book by its ID|
|[**getAllBooks**](#getallbooks) | **GET** /books | Get all books for the current user|
|[**getBookById**](#getbookbyid) | **GET** /books/{id} | Get a book by its ID|
|[**updateBook**](#updatebook) | **PUT** /books/{id} | Update a book by its ID|

# **addBook**
> BookResponse addBook(bookRequest)


### Example

```typescript
import {
    BookControllerApi,
    Configuration,
    BookRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BookControllerApi(configuration);

let bookRequest: BookRequest; //

const { status, data } = await apiInstance.addBook(
    bookRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bookRequest** | **BookRequest**|  | |


### Return type

**BookResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Book added successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteBook**
> deleteBook()


### Example

```typescript
import {
    BookControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BookControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteBook(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**404** | Book not found |  -  |
|**204** | Book deleted successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllBooks**
> Array<BookResponse> getAllBooks()


### Example

```typescript
import {
    BookControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BookControllerApi(configuration);

const { status, data } = await apiInstance.getAllBooks();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<BookResponse>**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of books returned successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getBookById**
> BookResponse getBookById()


### Example

```typescript
import {
    BookControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new BookControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getBookById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**BookResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Book found |  -  |
|**404** | Book not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateBook**
> BookResponse updateBook(bookRequest)


### Example

```typescript
import {
    BookControllerApi,
    Configuration,
    BookRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new BookControllerApi(configuration);

let id: number; // (default to undefined)
let bookRequest: BookRequest; //

const { status, data } = await apiInstance.updateBook(
    id,
    bookRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **bookRequest** | **BookRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**BookResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Book updated successfully |  -  |
|**404** | Book not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

