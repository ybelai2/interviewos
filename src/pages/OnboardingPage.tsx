--- a/src/pages/OnboardingPage.tsx
+++ b/src/pages/OnboardingPage.tsx
@@
   const { navigate } = useRouter();
   const [phase, setPhase] = useState<Phase>('upload');
-  const [fileName, setFileName] = useState('');
+  const [fileName, setFileName] = useState('');
+  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
   const [dragging, setDragging] = useState(false);
@@
-  const handleFile = useCallback((name: string) => {
-    setFileName(name);
-    setPhase('analyzing');
-  }, []);
+  const handleFile = useCallback(async (file: File) => {
+    setFileName(file.name);
+    setPhase('analyzing');
+    try {
+      const stored = localStorage.getItem('ios-user');
+      const userId = stored ? (JSON.parse(stored) as any).id : 'local-user';
+      const res = await resumeService.uploadResume(file, userId, (p) => setUploadProgress(p));
+      // uploaded and analyzed; show success then navigate
+      setTimeout(() => navigate('/app/resume'), 600);
+    } catch (err: any) {
+      console.error('upload failed', err);
+      setPhase('upload');
+      setUploadProgress(null);
+      alert(err?.error || err?.message || 'Upload failed');
+    }
+  }, [navigate]);
@@
-                  <label className="inline-block">
-                    <input
-                      type="file"
-                      accept=".pdf,.docx"
-                      className="hidden"
-                      onChange={(e) => {
-                        const f = e.target.files?.[0];
-                        if (f) handleFile(f.name);
-                      }}
-                    />
-                    <Button variant="outline" size="sm" asChild>
-                      <span>Browse Files</span>
-                    </Button>
-                  </label>
+                  <label className="inline-block">
+                    <input
+                      type="file"
+                      accept=".pdf,.docx"
+                      className="hidden"
+                      onChange={(e) => {
+                        const f = e.target.files?.[0];
+                        if (f) handleFile(f);
+                      }}
+                    />
+                    <Button variant="outline" size="sm" asChild>
+                      <span>Browse Files</span>
+                    </Button>
+                  </label>
@@
               <Card className="p-6">
-                <ProgressSteps steps={analysisSteps} currentStep={currentStep} />
+                <ProgressSteps steps={analysisSteps} currentStep={currentStep} />
+                {uploadProgress !== null && (
+                  <div className="mt-4 text-sm text-ink-muted">Upload progress: {uploadProgress}%</div>
+                )}
               </Card>
