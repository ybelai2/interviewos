@@
-    } catch (err: any) {
-      console.error('upload failed', err);
-      setPhase('upload');
-      setUploadProgress(null);
-      alert(err?.error || err?.message || 'Upload failed');
-    }
+    } catch (err: any) {
+      console.error('upload failed', err);
+      setPhase('upload');
+      setUploadProgress(null);
+      // Provide a user-friendly error modal or message
+      const message = err?.error || err?.message || 'Upload failed';
+      // If backend is not configured, give explicit instructions
+      if (message.includes('Backend not configured') || message.includes('OPENAI_API_KEY not configured') || message.includes('Database not configured')) {
+        alert(message + '\n\nThe application backend is not fully configured. Please check your environment variables or contact the site administrator.');
+      } else {
+        alert(message);
+      }
+    }
   }, [navigate]);
*** End Patch
