package com.fs.htmlclient;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Layout;
import android.text.SpannableString;
import android.text.style.AlignmentSpan;
import android.webkit.WebView;

import androidx.annotation.Nullable;

public class LaunchActivity extends Activity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            Thread.sleep(125);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        if (isWebViewVersionSupported())
            startMain();
    }

    private void startMain() {
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        finish();
    }

    private boolean isWebViewVersionSupported() {
        PackageInfo webViewPackage = WebView.getCurrentWebViewPackage();

        if (webViewPackage == null) {
            showAlert("No WebView found!", "No Android WebView Implementation found!\n\nPlease install from the PlayStore or consult the documentation.");
            return false;
        }

        String currentWebViewPackageVer = webViewPackage.versionName;

        if (currentWebViewPackageVer != null) {
            String webViewMajorStr = currentWebViewPackageVer.split("\\.")[0];

            int webViewMajor = Integer.parseInt(webViewMajorStr);

            int webViewMinVersion = 130;
            if (webViewMajor < webViewMinVersion) {
                showAlert("Outdated WebView Version", "Your current WebView Implementation version " + currentWebViewPackageVer + " is outdated.\n\nPlease install at least version " + webViewMinVersion + ", otherwise the app might not function properly.");
                return false;
            }
        }
        return true;
    }

    private void showAlert(String title, String message) {

        // Force flush left
        SpannableString messageSpan = new SpannableString(message);
        messageSpan.setSpan(new AlignmentSpan.Standard(Layout.Alignment.ALIGN_NORMAL), 0, message.length(), 0);

        new Handler(Looper.getMainLooper()).post(() ->
                new AlertDialog.Builder(this, androidx.appcompat.R.style.Theme_AppCompat_Light_Dialog_Alert)
                        .setTitle(title)
                        .setMessage(messageSpan)
                        .setCancelable(false)
                        .setPositiveButton("Continue", (dialog, which) -> startMain())
                        .show());
    }
}
