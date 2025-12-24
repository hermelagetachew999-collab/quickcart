import React from "react";

export default function Privacy() {
    return (
        <section className="info-page">
            <div className="info-container">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: December 24, 2025</p>

                <div className="info-content">
                    <h2>Introduction</h2>
                    <p>
                        At QuickCart, we take your privacy seriously. This Privacy Policy explains how we
                        collect, use, disclose, and safeguard your information when you visit our website
                        and use our services.
                    </p>

                    <h2>Information We Collect</h2>
                    <h3>Personal Information</h3>
                    <p>We may collect personal information that you voluntarily provide to us when you:</p>
                    <ul>
                        <li>Register for an account</li>
                        <li>Place an order</li>
                        <li>Contact our customer support</li>
                        <li>Subscribe to our newsletter</li>
                    </ul>
                    <p>This information may include:</p>
                    <ul>
                        <li>Name and contact information (email address, phone number)</li>
                        <li>Billing and shipping addresses</li>
                        <li>Payment information (processed securely through third-party providers)</li>
                        <li>Order history and preferences</li>
                    </ul>

                    <h3>Automatically Collected Information</h3>
                    <p>When you visit our website, we may automatically collect:</p>
                    <ul>
                        <li>Browser type and version</li>
                        <li>Device information</li>
                        <li>IP address</li>
                        <li>Pages visited and time spent on pages</li>
                        <li>Referring website addresses</li>
                    </ul>

                    <h2>How We Use Your Information</h2>
                    <p>We use the information we collect to:</p>
                    <ul>
                        <li>Process and fulfill your orders</li>
                        <li>Communicate with you about your orders and account</li>
                        <li>Improve our website and services</li>
                        <li>Send you marketing communications (with your consent)</li>
                        <li>Prevent fraud and enhance security</li>
                        <li>Comply with legal obligations</li>
                    </ul>

                    <h2>Information Sharing</h2>
                    <p>We do not sell your personal information. We may share your information with:</p>
                    <ul>
                        <li><strong>Service Providers:</strong> Third parties who help us operate our business (payment processors, shipping companies)</li>
                        <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                        <li><strong>Business Transfers:</strong> In connection with a merger, sale, or acquisition</li>
                    </ul>

                    <h2>Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your
                        personal information. However, no method of transmission over the internet is 100%
                        secure, and we cannot guarantee absolute security.
                    </p>

                    <h2>Your Rights</h2>
                    <p>You have the right to:</p>
                    <ul>
                        <li>Access the personal information we hold about you</li>
                        <li>Request correction of inaccurate information</li>
                        <li>Request deletion of your information</li>
                        <li>Opt-out of marketing communications</li>
                        <li>Object to processing of your information</li>
                    </ul>

                    <h2>Cookies</h2>
                    <p>
                        We use cookies and similar tracking technologies to enhance your browsing experience,
                        analyze site traffic, and understand where our visitors are coming from. You can
                        control cookies through your browser settings.
                    </p>

                    <h2>Children's Privacy</h2>
                    <p>
                        Our services are not intended for children under 13 years of age. We do not knowingly
                        collect personal information from children under 13.
                    </p>

                    <h2>Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any
                        changes by posting the new policy on this page and updating the "Last Updated" date.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have questions about this Privacy Policy, please contact us through our{" "}
                        <a href="/contact" className="inline-link">Contact page</a>.
                    </p>
                </div>
            </div>
        </section>
    );
}
