package in.timt.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.net.Uri;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.ViewGroup;
import android.webkit.GeolocationPermissions;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.IOException;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_PERMISSIONS = 1;
    private LocalHttpServer localHttpServer;
    private WebView webView;
    private String savedUrl = "http://localhost:65534";  // Default URL
    private ValueCallback<Uri[]> fileUploadCallback;
    private ActivityResultLauncher<Intent> filePickerLauncher;
    private GeolocationPermissions.Callback pendingGeolocationCallback;
    private String pendingGeolocationOrigin;

    private LocationManager locationManager;
    private LocationListener locationListener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        localHttpServer = new LocalHttpServer(this, 65534); // Or any port you want
        try {
            localHttpServer.start();
        } catch (IOException e) {
            e.printStackTrace();
        }

        setContentView(R.layout.activity_main); // Make sure you have the layout file

        webView = findViewById(R.id.webView);
        webView.post(this::adjustWebViewSize); // Adjust size after view is ready

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
                Log.d("GeolocationPrompt", "Origin: " + origin);
                // Check for location permissions at runtime
                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
                        ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    callback.invoke(origin, true, false); // Grant if permissions are already granted
                } else {
                    // Request permissions if not granted (and handle the result in onRequestPermissionsResult)
                    ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION}, REQUEST_PERMISSIONS);
                    // Store callback for later use
                    pendingGeolocationCallback = callback;
                    pendingGeolocationOrigin = origin;
                }
            }

            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = filePathCallback;

                Intent intent = fileChooserParams.createIntent();
                try {
                    filePickerLauncher.launch(intent);
                } catch (Exception e) {
                    fileUploadCallback = null;
                    return false;
                }
                return true;
            }

            @Override
            public void onPermissionRequest(PermissionRequest request) {
                // Grant all permissions requested by the WebView
                request.grant(request.getResources());
            }
        });

        webView.setWebViewClient(new WebViewClient());

        if (savedInstanceState != null) {
            savedUrl = savedInstanceState.getString("savedUrl", savedUrl);
        }
        webView.loadUrl(savedUrl);

        grantPermissions(); // Request permissions

        filePickerLauncher = registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
            if (fileUploadCallback != null) {
                Uri[] results = null;
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    results = new Uri[]{result.getData().getData()};
                }
                fileUploadCallback.onReceiveValue(results);
                fileUploadCallback = null;
            }
        });

        // Initialize LocationManager and LocationListener for GPS
        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        locationListener = new LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
                Log.d("Location", "Latitude: " + location.getLatitude() + ", Longitude: " + location.getLongitude());
                // You can handle location updates here if needed
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {}

            @Override
            public void onProviderEnabled(String provider) {}

            @Override
            public void onProviderDisabled(String provider) {}
        };

        // Check if GPS is enabled and prompt user to turn it on if not
        boolean isGpsEnabled = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        if (!isGpsEnabled) {
//            Toast.makeText(this, "Please enable GPS for this feature", Toast.LENGTH_SHORT).show();
            Intent intent = new Intent(android.provider.Settings.ACTION_LOCATION_SOURCE_SETTINGS);
            startActivity(intent);
        } else {
            // Request location updates once GPS is enabled
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener);
            }
        }
    }

    private void adjustWebViewSize() {
        float screenSizeCm = 16.33f; // Example value, replace with yours
        DisplayMetrics metrics = getResources().getDisplayMetrics();
        float cmToPx = screenSizeCm * (metrics.xdpi / 2.54f);
        if (cmToPx > 0) {
            ViewGroup.LayoutParams params = webView.getLayoutParams();
            params.width = (int) cmToPx;
            webView.setLayoutParams(params);
        }
    }

    private void grantPermissions() {
        String[] permissions = {
                Manifest.permission.INTERNET,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.CAMERA,
                Manifest.permission.RECORD_AUDIO,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
        };

        if (!hasPermissions(permissions)) {
            ActivityCompat.requestPermissions(this, permissions, REQUEST_PERMISSIONS);
        } else {
//            Toast.makeText(this, "Permissions granted automatically", Toast.LENGTH_SHORT).show();
        }
    }

    private boolean hasPermissions(String[] permissions) {
        for (String permission : permissions) {
            if (ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                return false;
            }
        }
        return true;
    }

    @SuppressLint("MissingSuperCall")
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == REQUEST_PERMISSIONS) {
            boolean allGranted = true;
            for (int result : grantResults) {
                if (result != PackageManager.PERMISSION_GRANTED) {
                    allGranted = false;
                    break;
                }
            }
            if (allGranted) {
//                Toast.makeText(this, "Permissions granted", Toast.LENGTH_SHORT).show();
                // Handle geolocation callback if permissions are granted
                if (pendingGeolocationCallback != null) {
                    pendingGeolocationCallback.invoke(pendingGeolocationOrigin, true, false);
                    pendingGeolocationCallback = null;
                    pendingGeolocationOrigin = null;
                }
            } else {
//                Toast.makeText(this, "Some permissions were denied", Toast.LENGTH_LONG).show();
                // Handle geolocation callback if permissions are denied
                if (pendingGeolocationCallback != null) {
                    pendingGeolocationCallback.invoke(pendingGeolocationOrigin, false, false); // Deny
                    pendingGeolocationCallback = null;
                    pendingGeolocationOrigin = null;
                }
            }
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putString("savedUrl", savedUrl);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (localHttpServer != null) {
            localHttpServer.stop();
        }
        if (locationManager != null) {
            locationManager.removeUpdates(locationListener);
        }
    }
}
