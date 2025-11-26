package com.fs.htmlclient;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.text.Layout;
import android.text.SpannableString;
import android.text.style.AlignmentSpan;
import android.webkit.WebView;
import android.widget.Button;

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
      showAlert("No WebView found!", "No Android WebView Implementation found!\n\nPlease install from the PlayStore.", "Install");
      return false;
    }

    String currentWebViewPackageVer = webViewPackage.versionName;

    if (currentWebViewPackageVer != null) {
      String webViewMajorStr = currentWebViewPackageVer.split("\\.")[0];

      int webViewMajor = Integer.parseInt(webViewMajorStr);

      int webViewMinVersion = 130;
      if (webViewMajor < webViewMinVersion) {
        showAlert("Outdated WebView Version", "Your current WebView Implementation version " + currentWebViewPackageVer + " is outdated.\n\nPlease install at least version " + webViewMinVersion + ", otherwise the app might not function properly.", "Update");
        return false;
      }
    }

    return true;
  }

  private void showAlert(String title, String message, String requiredAction) {

    // Force flush left
    SpannableString messageSpan = new SpannableString(message);
    messageSpan.setSpan(new AlignmentSpan.Standard(Layout.Alignment.ALIGN_NORMAL), 0, message.length(), 0);

    new Handler(Looper.getMainLooper()).post(() -> {
      AlertDialog dialog = new AlertDialog.Builder(this, androidx.appcompat.R.style.Theme_AppCompat_Light_Dialog_Alert)
        .setTitle(title)
        .setMessage(messageSpan)
        .setCancelable(false)
        .setNeutralButton("Help", (d, which) -> {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("https://frameworksystemsgmbh.github.io/fsdocs/v4.5/doc/html-client/android-app.html?q=webview#systemvoraussetzungen"));
        startActivity(intent);
        })
        .setNegativeButton(requiredAction + " WebView", (d, which) -> {
        Intent intent = new Intent(Intent.ACTION_VIEW);
        intent.setData(Uri.parse("market://details?id=com.google.android.webview"));
        startActivity(intent);
        })
        .setPositiveButton("Continue", (d, which) -> startMain())
        .create();

      // Suppress excess whitespace below Buttons
      dialog.setOnShowListener(dialogInterface -> {
        Button helpButton = dialog.getButton(AlertDialog.BUTTON_NEUTRAL);
        Button installButton = dialog.getButton(AlertDialog.BUTTON_NEGATIVE);
        Button continueButton = dialog.getButton(AlertDialog.BUTTON_POSITIVE);

        if (helpButton != null) {
          helpButton.setAllCaps(false);
          helpButton.setTextSize(16);
        }
        if (installButton != null) {
          installButton.setAllCaps(false);
          installButton.setTextSize(16);
        }
        if (continueButton != null) {
          continueButton.setAllCaps(false);
          continueButton.setTextSize(16);
        }
      });

      dialog.show();
    });
  }
}
