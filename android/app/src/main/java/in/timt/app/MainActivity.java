package in.timt.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.annotation.NonNull;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_PERMISSIONS_1 = 1;
    private static final int REQUEST_PERMISSIONS_2 = 2;
    private WebView webView;
    private String savedUrl = "https://app.timt.in";  // Default URL

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Initialize WebView and setup settings
        webView = findViewById(R.id.webView);
        WebSettings webSettings = webView.getSettings();

        // Modern WebView settings
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);  // Enable DOM storage
        webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);  // Use cache when offline
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setGeolocationEnabled(true);  // Allow Geolocation
        webSettings.setMediaPlaybackRequiresUserGesture(false);  // Allow autoplay of media

        // Set WebChromeClient to handle location/camera permissions
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final android.webkit.PermissionRequest request) {
                if (request.getResources().length > 0) {
                    request.grant(request.getResources());
                }
            }
        });

        // Handle page loading and errors
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                savedUrl = url; // Save the URL when the page starts loading
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (Uri.parse(url).getHost() != null && !Uri.parse(url).getHost().equals("app.timt.in")) {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                }
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                view.loadUrl("file:///android_asset/error.html");
            }
        });

        // If activity is being recreated (e.g., after rotation or permission request), reload the saved URL
        if (savedInstanceState != null) {
            savedUrl = savedInstanceState.getString("savedUrl", savedUrl);
        }

        // Load the website (either saved URL or default URL)
        webView.loadUrl(savedUrl);

        // Request permissions when the app is launched
        requestPermissions();
    }

    private void requestPermissions() {
        String[] permissions1 = {
                Manifest.permission.INTERNET,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.READ_EXTERNAL_STORAGE
        };

        // Request the first set of permissions
        ActivityCompat.requestPermissions(this, permissions1, REQUEST_PERMISSIONS_1);
    }

    @SuppressLint("MissingSuperCall")
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        switch (requestCode) {
            case REQUEST_PERMISSIONS_1:
                // Check if the first set of permissions was granted
                boolean allPermissionsGranted = true;
                for (int result : grantResults) {
                    if (result != PackageManager.PERMISSION_GRANTED) {
                        allPermissionsGranted = false;
                    }
                }

                if (allPermissionsGranted) {
                    // Request the second set of permissions (including Camera)
                    String[] permissions2 = {Manifest.permission.CAMERA};
                    ActivityCompat.requestPermissions(this, permissions2, REQUEST_PERMISSIONS_2);
                } else {
                    // Handle the case where permissions were not granted
                    // (e.g., show a message to the user)
                    Toast.makeText(this, "Permissions not granted", Toast.LENGTH_SHORT).show();
                }
                break;

            case REQUEST_PERMISSIONS_2:
                // Handle the camera permission request result
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // Camera permission granted, continue with your app logic
                } else {
                    // Handle the case where the camera permission was not granted
                    Toast.makeText(this, "Camera permission not granted", Toast.LENGTH_SHORT).show();
                }
                break;
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        // Save the current URL before activity is destroyed
        outState.putString("savedUrl", savedUrl);
    }

    @Override
    public void onBackPressed() {
        // Check if the WebView can go back
        if (webView != null && webView.canGoBack()) {
            webView.goBack();  // Go back to the previous page in WebView
        } else {
            super.onBackPressed();  // Default back button behavior (exit app if no pages to go back)
        }
    }
}
