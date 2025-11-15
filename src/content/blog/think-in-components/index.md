---
title: Messy UI? Think In Components, Not HTML & CSS
description: Achieve consistent UI with Design Systems and Component Libraries.
date: 2021-10-04
tags:
  - best-practice
  - design
---

I have seen too many companies fall into the trap of thinking they don't need a
design system. This often leads to inconsistent ugly looking products. It also
drags down velocity by repeated bug fixes on small UI details, draining time not
only for developers, but also QA, Design, and Product Teams. It is never too
early to adopt a design system.

## The Problem

Have you ever encountered conversations like this between designers and
developers?

> Your margin on this widget is 3 pixels off.
>
> The font size on this button is too big.
>
> The font color is not right shade.
>
> The site looks inconsistent. Look at these two buttons...

The designer have to make sure his design is always consistent, or else the
developer is going to implement it inconsistently. The designer will have to
double check the developer's work to ensure the final product is correct. The
developer will have to adjust his CSS and HTML to make it pass the Design Team,
but occasionally, his changes break another page because he didn't know changing
the CSS in one spot could affect some widget in a completely different page. And
the cycle repeats itself.

This kind of communication very inefficient for both the design team and the
development team. It produces messy and inconsistent UI, it takes a long time
for a feature to pass QA. Yet I have seen this problem crop up in many companies
I have worked with.

To sum it up, the real issue here is design and development are communicating
with the wrong level of abstraction.

## The Solution

Now let's imagine a different conversation:

> This widget uses the **PricingPlan Component**.
>
> That button is a **Button Component** with **secondary variant** and **small
> size**.

The conversation is no longer about specific sizes in pixels or color values.
The designer and the developer both have a common language, and that language is
call the **Design Language**. The specific margins, color shades, and sizes are
predefined and agreed upon.

**Component Libraries** based on the Design Language are available for
developers to implement the designs quickly and consistently. The features can
be churned out quickly with minimal revisions. The designer trusts the
developer's implementations. The UI looks consistent throughout the site, and
new features gets pushed to production without much revisions.

This is all thanks to a **Design System** shared between the design and
development team.

## Design System Explained

A Design System is a set of interconnected patterns and shared practices
coherently organized. Design Systems aid in digital product design and
development of products such as apps or websites. They may contain, but are not
limited to, pattern libraries, design languages, style guides, coded components,
brand languages, and documentation.

To put it in simpler terms, a Design System allows designers and developers
communicate efficiently.

Some well known Design Systems includes:

- [Material Design](https://material.io/components) by Google
- [Fluent](https://developer.microsoft.com/en-us/fluentui#/) by Microsoft
- [Lightning](https://www.lightningdesignsystem.com/) by Salesforce
- [Bootstrap](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
  by Twitter
- [Bulma](https://bulma.io/) by Jeremy Thomas

Note, Bootstrap and Bulma are not full fledged Design Systems. But many
companies use them as a starting point to create their own Design Systems.

Ok, enough about Design Systems. How can I achieve product consistency and
development efficiency by adopting a Design System for my teams?

## Adoption And Implementation

From here on, I'm going to assume an existing Design System, such as
[Material Design](https://material.io/components), is used as the basis for your
company. You can also create a new Design System from scratch, but that will
take much longer.

The Design Team needs to decide on which Design Language or Design Framework to
use. The Development Team needs to weigh in on that decision because they will
need to decide on an existing component library implementing the chosen Design
Language to customize to fit into the Design Language.

For example, the Design Team decides to use
[Material Design](https://material.io/components) as the base. The Development
Team primarily uses React as the front end framework, and thus chose
[material-ui](https://mui.com/) as the basis for their Component Library. It is
a good choice because it offers
[global theme support](https://mui.com/customization/theming/). It also allows
[customization on the component level](https://mui.com/customization/how-to-customize/).
It also offers a large set of
[components](https://mui.com/customization/how-to-customize/), as well as
[many](https://github.com/gregnb/mui-datatables)
[extensions](https://www.npmjs.com/package/@mui/lab).

Whatever component library your team ends up choosing, there are limits to how
much customization it supports. Thus Design Team must work with Development Team
to pick something that can ensure all the customizations can be done easily and
efficiently in the component library.

### Design Team Goals

After the base Design System is chosen, the design team can move on to the
following goals.

**Catalog Components**

It is important to know how many components and variants your product uses. The
design team should catalog all components used on the site. All products should
be based off of those components.

**Design Components**

After components are categorized, the designer can now create those components
in their design tools. [Figma](https://www.figma.com/) is a popular used by
design teams to collaborate on design work. It has
[reusable component support](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-Components-in-Figma),
allowing designers to design and reuse components collaboratively.

**_Reuse Components_**

When all the individual components are created in the design tools, all new
designs should reuse existing components. If there is a need, new components or
variants of existing components can be added. However, designers should no
longer directly use position and color values. They should all be defined inside
components.

### Development Team Goals

After the base Design System is chosen, the development team can move on to the
following goals.

**Choose Component Library**

An existing open source component library such as
[material-ui](https://mui.com/) should be chosen at this stage. Developers
should be encouraged to learn about this new library.

**Implement Theme Extension**

At this stage, developers should create a new theme package that can be used to
customize the base component library to suit the company Design Language. The
theme should be its own npm package, hosted privately, that can be shared and
reused across different frontend projects.

A [storybook](https://storybook.js.org/) should also be created and provisioned
to display all the different components from the component library with themes
applied. If you use Figma as a development tool, you can use the
[Figma Addon for Storybook](https://help.figma.com/hc/en-us/articles/360045003494-Storybook-and-Figma)
to make sure component design and implementation are always in sync.

**Extend Component Library**

It's very likely that your base component library does not include all the
components the design team catalogued. This is when a component library
extension is needed. Depending on the need, your development team can create an
extension library to host all the extra components not covered by the base
library. It can then be packaged as an npm component and shared across your
projects.

**Reuse Component Library**

Finally, once the component library is setup, themes are implemented, and
extensions are built, your development team can implement new features based
purely on components. It's also a good time to start refactoring old pages to
new component-based implementations. Now you will have a beautiful, consistent
UI. Your design and development team will also see increased product delivery
and your employees will be happier.
