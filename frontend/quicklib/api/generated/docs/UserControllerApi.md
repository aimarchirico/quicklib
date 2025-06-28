# UserControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**deleteUser**](#deleteuser) | **DELETE** /api/user | Delete the current user|
|[**getOrCreateUser**](#getorcreateuser) | **GET** /api/user | Get or create the current user|

# **deleteUser**
> deleteUser()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.deleteUser();
```

### Parameters
This endpoint does not have any parameters.


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
|**204** | User deleted successfully |  -  |
|**404** | User not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getOrCreateUser**
> UserResponse getOrCreateUser()


### Example

```typescript
import {
    UserControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new UserControllerApi(configuration);

const { status, data } = await apiInstance.getOrCreateUser();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**UserResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: */*


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | User returned or created successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

