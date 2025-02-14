package in.timt.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.pm.PackageManager;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.ViewGroup;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.ValueCallback;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

public class MainActivity extends AppCompatActivity {

    private static final int REQUEST_PERMISSIONS = 1;
    private final LocalHttpServer localHttpServer;
    private WebView webView;
    private String savedUrl = "https://app.timt.in/";  // Default URL
    private ValueCallback<Uri[]> fileUploadCallback;
    private ActivityResultLauncher<Intent> filePickerLauncher;

    public MainActivity(LocalHttpServer localHttpServer) {
        this.localHttpServer = localHttpServer;
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Initialize and start the server
//        localHttpServer = new LocalHttpServer(this, 65534); // Set the port to whatever you want
//        try {
//            localHttpServer.start();
//        } catch (IOException e) {
//            e.printStackTrace();
//        }


        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webView);
        webView.post(this::adjustWebViewSize);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setGeolocationEnabled(true);
        webSettings.setMediaPlaybackRequiresUserGesture(false);

        // Handle permissions for WebView (Camera, Location, File access)
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final android.webkit.PermissionRequest request) {
                runOnUiThread(() -> request.grant(request.getResources()));
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
        });

        webView.setWebViewClient(new WebViewClient());

        if (savedInstanceState != null) {
            savedUrl = savedInstanceState.getString("savedUrl", savedUrl);
        }
        webView.loadUrl(savedUrl);

        requestPermissions();

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
    }

    private void adjustWebViewSize() {
        float screenSizeCm = 16.33f;
        DisplayMetrics metrics = getResources().getDisplayMetrics();
        float cmToPx = screenSizeCm * (metrics.xdpi / 2.54f);
        if (cmToPx > 0) {
            ViewGroup.LayoutParams params = webView.getLayoutParams();
            params.width = (int) cmToPx;
            webView.setLayoutParams(params);
        }
    }

    private void requestPermissions() {
        String[] permissions = {
                Manifest.permission.INTERNET,
                Manifest.permission.ACCESS_FINE_LOCATION,
                Manifest.permission.ACCESS_COARSE_LOCATION,
                Manifest.permission.CAMERA,
                Manifest.permission.READ_EXTERNAL_STORAGE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
        };

        if (!hasPermissions(permissions)) {
            ActivityCompat.requestPermissions(this, permissions, REQUEST_PERMISSIONS);
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
        }
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        outState.putString("savedUrl", savedUrl);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
            if(webView.canGoBack()){
                webView.reload();
            }
        } else {
            super.onBackPressed();
        }
    }
    @Override
    protected void onDestroy() {
        super.onDestroy();

        // Stop the server when the activity is destroyed
//        if (localHttpServer != null) {
//            localHttpServer.stop();
//        }
    }
}
