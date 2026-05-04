Content Security Policy (CSP) header is not set instances: 4
Description: Content Security Policy (CSP) is an added layer of protection provided through a set of http headers which allow website owners to define allowed content origins for different types of content such as JavaScript, CSS, HTML frames, fonts and images. Content Security Policy will assist in detecting and preventing cross-site scripting (XSS), data-injection attacks and other types of attacks which could result in stolen data, damaged sites and/or malicious code distributed.

Solution: make sure your web server, application server or load balancer is configured to send the content-security-policy header.

2. Missing click-jack protection (anti-ClickJacking) header instances: 2
Description: the application response is vulnerable to click-jacking type attacks.

Solution: ensure that one of two options are enabled; the content-security-policy with the frame-ancestors directive or the X-Frame-Options http header. If you expect only pages from your own server to be able to frame pages on your site then use sameorigin. If you do not ever expect to have pages framed then use deny.

3. Only served over http instances: 1
Description: the site is only available over http and not HTTPS.

Solution: set up your web or application server to support SSL (HTTPS).

 low-risk vulnerabilities

1. Server exposes version number via "server" http response headerfield instances: systemic
Description: the web or application server is exposing its version number (identified as nginx/1.29.8) through the "server" http response header. Knowing this information may make it easier for attackers to locate specific vulnerabilities tied to the identified version of the server software.

Solution: make sure your web server, application server or load balancer has been configured so that the "server" header cannot be sent at all or can include generic values.

2. In page banner provides version information instances: 2
Description: a version banner string was found in the response body (nginx/1.29.8).

Solution: configure the server so that it does not leak information like this. As an example, with Apache, this can be achieved using the "ServerTokens" and "ServerSignature" directives

3. X-Content-Type-Options missing. Instances: 5. Description: the X-Content-Type-Options anti-mime sniffing header was not set to "nosniff". Although it does not directly allow mime-sniffing in current browsers, it can be exploited by older versions of internet explorer and Chrome, which will attempt to determine whether a page should be rendered based upon its mime type rather than the specified Content-Type. Solution: ensure that the X-Content-Type-Options is always set to nosniff; and the Content-Type header is always set correctly. 

Informational FindingsModern Web Application structure: scripts were found without associated links. A modern web application structure has been identified (2 times). the Ajax Spider may provide better results when performing automated discovery as opposed to the standard spider. No configuration changes are needed.