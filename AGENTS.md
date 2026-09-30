# Permanent Coding Instructions & Rules

These instructions are permanent project guidelines and must be followed for all tasks and features in this project.

## 1. Do Not Over-Engineer
Always prefer the **simplest correct solution**.
* Do not over-engineer a feature or fix.
* Do not introduce unnecessary abstractions, wrappers, utilities, hooks, services, types, components, or files.
* Do not create additional layers just because they are theoretically possible.
* Do not write more code simply to solve a problem that can be solved with the existing code.
* Avoid premature optimization and unnecessary refactoring.
* Keep implementations proportional to the actual requirement.

> **Rule:** If a simple solution works correctly and follows the existing project architecture, prefer it over a complex solution.

---

## 2. Understand the Existing Code Before Changing Anything
Before implementing or modifying code, **properly inspect the relevant existing codebase**.
Do not immediately start writing code.
1. Understand the project structure.
2. Find the relevant feature/module.
3. Read the existing components, hooks, services, utilities, types, API functions, and patterns related to the task.
4. Check whether the required functionality already exists somewhere.
5. Check whether an existing component/function can be reused.
6. Check how similar functionality is already implemented elsewhere.
7. Identify the project's established coding patterns and follow them.

Only after understanding the existing implementation should you decide what needs to change.

---

## 3. Always Ask: "Is This Code Actually Necessary?"
Before adding new code, evaluate:
* Is this functionality already implemented?
* Can an existing component/function/hook/service be reused?
* Can the current code simply be modified?
* Is the requested behavior already supported?
* Is there a simpler change that achieves the same result?
* Will this new abstraction provide real value?
* Am I adding code only because it feels cleaner, rather than because it is required?

If the answer is that existing code can handle the requirement, **do not create additional code**.

---

## 4. Prefer Reuse Over Duplication
Before creating anything new, search the codebase.
For example, do not create:
* A new component if an existing component can be reused.
* A new API service if an existing API service already handles the same pattern.
* A new hook if an existing hook can be extended.
* A new utility for a one-line operation.
* A new type if an appropriate existing type already exists.
* A new state-management solution when existing state management is sufficient.

Prefer **small modifications to existing code** over creating parallel implementations.

---

## 5. Do Not Fix Problems by Adding Unnecessary Complexity
When something is not working, do not immediately add extra state, effects, API calls, duplicate validation, unnecessary error-handling layers, new abstractions, workaround components, or complicated conditional logic.

Instead, investigate the **root cause first**:
> *"Why is this happening with the current implementation?"*

Then fix the root cause with the **minimum necessary change**.

---

## 6. Follow Existing Project Patterns
The existing codebase is the primary reference for implementation style.
When adding functionality:
* Follow existing folder structure.
* Follow existing naming conventions.
* Follow existing component patterns.
* Follow existing API patterns.
* Follow existing error-handling patterns.
* Follow existing TypeScript patterns.
* Follow existing state-management patterns.
* Reuse existing shared components (`DataTable`, `DetailsDrawer`, `StatusBadge`, `ConfirmModal`, `SearchBar`, etc.).
* Reuse existing styling conventions.

Do not introduce a completely new pattern unless there is a clear technical reason.

---

## 7. Analyze First, Implement Second
For every non-trivial task, follow this process:
1. **Inspect**: Read the relevant existing code.
2. **Understand**: Determine how the current implementation works.
3. **Evaluate**: Determine whether the requested functionality can be achieved using existing code.
4. **Plan**: Choose the **smallest reasonable change**.
5. **Implement**: Only write the code that is actually required.
6. **Verify**: Check that the implementation works and does not unnecessarily affect existing functionality.

---

## 8. Before Writing New Code, Explain the Necessity
If you are about to introduce a new component, hook, utility, service, abstraction, dependency, or significant architectural change, first determine whether it is genuinely necessary.

If there are multiple possible approaches, prefer the one with:
**Less code + less complexity + better reuse + consistency with the existing project.**

---

## 9. Avoid "Code for the Sake of Code"
Do not assume that more code means a better implementation.
A good implementation is not the one with the most files, functions, abstractions, or interfaces.

---

## Production Readiness Checklist ("Don't Skip These in Vibe Coded App")

Ensure every web application feature meets this comprehensive checklist:

1. **Privacy Policy**: Dedicated, accessible privacy policy page/modal outlining data usage.
2. **Terms & Conditions**: Transparent legal and user usage terms.
3. **Remove Frontend Secrets**: Never expose API secret keys, database credentials, or private keys in client code or version control. Use secure backend proxy or environment variables.
4. **Enforce HTTPS**: Use secure protocol references and HTTPS redirection headers / CSP.
5. **Cookie Consent Banner**: Informative, non-intrusive cookie and consent preferences banner.
6. **Meta Titles & Descriptions**: Meaningful, SEO-optimized title tags and meta descriptions per route/page.
7. **Social Preview Image**: Proper OpenGraph (`og:image`) and Twitter Card (`twitter:image`) meta tags.
8. **Favicon**: High-resolution SVG and PNG favicon variants with proper manifest linking.
9. **Sitemap & robots.txt**: Valid `sitemap.xml` and standard `robots.txt` in the public root.
10. **Image Alt Text**: Comprehensive, accessible `alt` attributes on all images.
11. **Image Compression**: Optimize and modern-format (WebP/AVIF/SVG) assets to minimize payload.
12. **Page Load Speed Check**: Fast initial load, code splitting, lazy loading, and minimal bundle sizes.
13. **Color Contrast Fixes**: WCAG AA/AAA compliant color contrast for text and interactive elements.
14. **Mobile Responsiveness**: Fluid, mobile-first design that functions smoothly on all screen sizes.
15. **Custom 404 Page**: Friendly, helpful 404 Not Found route with navigation back to safety.
16. **Broken Link Fixes**: All navigational links and buttons must lead to valid routes or handlers.
17. **Form Validation**: Strict client-side validation with clear, friendly error feedback before submission.
18. **Spam Protection**: Client and API protection (honeypot fields, rate limiting, input sanitization).
19. **Analytics Setup**: Privacy-conscious event and telemetry tracking (e.g., page views, core interactions).
20. **Single Clear CTA**: Every primary page or flow must present one focused, prominent Call to Action.
