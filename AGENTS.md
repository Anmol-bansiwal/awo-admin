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
