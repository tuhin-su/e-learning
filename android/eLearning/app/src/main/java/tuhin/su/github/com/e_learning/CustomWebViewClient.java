package tuhin.su.github.com.e_learning;

import android.webkit.GeolocationPermissions;

public interface CustomWebViewClient {
    void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback);
}
