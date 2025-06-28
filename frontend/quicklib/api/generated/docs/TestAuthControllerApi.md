# TestAuthControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**testAuth**](#testauth) | **GET** /api/test-auth | Test authentication and return authentication details|

# **testAuth**
> { [key: string]: object; } testAuth()


### Example

```typescript
import {
    TestAuthControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new TestAuthControllerApi(configuration);

const { status, data } = await apiInstance.testAuth();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**{ [key: string]: object; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Authentication status returned successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

