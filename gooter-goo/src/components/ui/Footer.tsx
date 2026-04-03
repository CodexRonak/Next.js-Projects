import React from "react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Top Section - Logo + Links */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
          {/* Logo Section */}
          <div>
            <span className="text-xl font-bold tracking-tight">Gooter-Goo</span>
            <p className="text-sm text-muted-foreground mt-1">
              The future of communication
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Support
            </a>
          </div>
        </div>

        {/* Bottom Disclaimer - Alag section mein */}
        <div className="mt-10 pt-6 border-t text-center">
          <p className="text-xs text-muted-foreground">
            2025 Gooter-Goo. This is a Demo. We have no affiliation with any of
            the brands mentioned in the video including Gooter-Goo, any usage is
            purely educational, in the event of any infringement, please contact
            us and we will remove/alter the content immediately.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
