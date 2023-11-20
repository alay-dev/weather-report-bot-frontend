"use client";

import { useGoogleOAuth2 } from "@/context/oauth";
import { useCallback, useEffect, useRef, useState } from "react";

export type NonOAuthError = {
  type: "popup_failed_to_open" | "popup_closed" | "unknown";
};

export type Client = {
  requestCode: () => void;
  requestAccessToken: () => void;
};

export type OverridableTokenClientConfig = {
  hint?: string;
  state?: string;
  enable_serial_consent?: boolean;
  prompt?: "" | "none" | "consent" | "select_account";
};

export type GoogleErrorCode = "invalid_request" | "access_denied" | "unauthorized_client" | "unsupported_response_type" | "invalid_scope" | "server_error" | "temporarily_unavailable";

export type GoogleTokenResponse = {
  access_token: string;
  expires_in: number;
  hd?: string;
  prompt: string;
  token_type: string;
  scope: string;
  state?: string;
  error?: GoogleErrorCode;
  error_description?: string;
  error_uri?: string;
};

/** Google Authentication with Custom OAuth2 Request */

type UseGoogleLogin = {
  scope?: string;
  overrideScope?: boolean;
  flow?: "implicit" | "auth-code";
  onNonOAuthError?: (error: any) => void;
  onError?: (error: Pick<GoogleTokenResponse, "error" | "error_description" | "error_uri">) => void;
  onSuccess?: (response: Omit<GoogleTokenResponse, "error" | "error_description" | "error_uri">) => void;
};

export function useGoogleLogin({ flow = "implicit", scope = "", overrideScope, onSuccess, onError, onNonOAuthError }: UseGoogleLogin) {
  const client = useRef<Client>();
  const google = useGoogleOAuth2();

  useEffect(() => {
    if (!google.isLoaded) return;

    const _window = window as any;
    const method = flow === "implicit" ? "initTokenClient" : "initCodeClient";

    client.current = _window.google?.accounts.oauth2[method]({
      client_id: google.clientId,
      scope: overrideScope ? scope : `openid profile email ${scope}`,
      callback: (response: GoogleTokenResponse) => {
        if (response.error) return onError?.(response);
        onSuccess?.(response);
      },
      error_callback: (error: NonOAuthError) => {
        onNonOAuthError?.(error);
      },
    });
  }, [google.clientId, google.isLoaded, flow, scope]);

  const loginWithGoogle = useCallback(() => {
    if (flow === "implicit") return client.current?.requestAccessToken();
    client.current?.requestCode();
  }, [flow]);

  return loginWithGoogle;
}

/** End of Google Authentication with Custom OAuth2 Request */

/** Google Authentication with Sign In With Google Button */

type UseInitializeGoogleAuthentication = {
  prompt?: boolean;
  button?: HTMLElement | null;
  onError?: (error: any) => void;
  onSuccess?: (response: string) => void;
};

type GoogleCallbackResponse = {
  clientId: string;
  client_id: string;
  credential: string;
  select_by: string;
};

export function useInitializeGoogleAuthentication({ prompt, button, onSuccess, onError }: UseInitializeGoogleAuthentication) {
  const google = useGoogleOAuth2();

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!google.isLoaded) return;
    const _window = window as any;
    _window.google?.accounts.id.initialize({
      client_id: google.clientId,
      callback: (response: GoogleCallbackResponse) => {
        onSuccess?.(response.credential);
      },
    });
    setIsInitialized(true);
  }, [google.isLoaded]);

  useEffect(() => {
    if (!isInitialized || !button) return;
    const _window = window as any;
    try {
      _window.google?.accounts.id.renderButton(button, { type: "standard", shape: "rectangular", theme: "outline" });
    } catch (error) {
      console.log("Unable to initialize google login: ", error);
    }
  }, [isInitialized, button]);

  useEffect(() => {
    if (!prompt || !isInitialized) return;
    const _window = window as any;
    try {
      _window.google?.accounts.id.prompt();
    } catch (error) {
      console.log("Unable to initialize google prompt: ", error);
    }
  }, [prompt, isInitialized]);
}

/** End of Google Authentication with Sign In With Google Button */
