package in.timt.app;

import android.content.Context;
import android.content.res.AssetManager;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;

import fi.iki.elonen.NanoHTTPD;

public class LocalHttpServer extends NanoHTTPD {

    private final AssetManager assetManager;

    public LocalHttpServer(Context context, int port) {
        super(port);
        this.assetManager = context.getAssets(); // Get the AssetManager
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();

        if (uri.equals("/")) {
            uri = "/index.html"; // Default file to serve
        }

        try {
            InputStream inputStream = assetManager.open(uri.substring(1)); // Load file from assets
            int fileLength = inputStream.available();
            return NanoHTTPD.newFixedLengthResponse(Response.Status.OK, getMimeType(uri), inputStream, fileLength);
        } catch (IOException e) {
            e.printStackTrace();
            return NanoHTTPD.newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "404 Not Found");
        }
    }

    private String getMimeType(String uri) {
        if (uri.endsWith(".html")) return "text/html";
        if (uri.endsWith(".css")) return "text/css";
        if (uri.endsWith(".js")) return "application/javascript";
        if (uri.endsWith(".png")) return "image/png";
        if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
        if (uri.endsWith(".gif")) return "image/gif";
        return "application/octet-stream";
    }
}
