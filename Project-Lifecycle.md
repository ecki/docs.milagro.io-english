The term “project” within the Apache Milagro (incubating) Project will refer to a collaborative effort in the community to deliver a cryptographic feature or enhancement that enables the construction of a "Crypto App". A Crypto App is defined as a code that can be embedded by other software or hardware applications, and whose keys are generated and managed by Distributed Trust Authority actors.

Additionally, there may be some projects that are intended to produce a document, such as a requirements or use cases document, a white-paper, or analysis. Others may be to develop a new capability, or refactor (or remove) an existing capability for Milagro technology releases. Such projects may take the form of a new component or may propose additions, deletions or changes to an existing technology.

Milagro technology, and the software and hardware that relies on it, depends on the security efficacy of the cryptography that serves as the backbone of this platform. It is critical that a review process be established for any and all cryptographic proposals.

Many other open source initiatives leverage an incubation process for new work items, and this seems to have a desired effect of encouraging new ideas and tracks of work, while at the same time providing clear guidance to the broader community as to what is real and supported, versus what is still in the exploratory/experimental/developmental phases. This also helps define the higher priority stories and epics that will go into the Apache Milagro (incubating) (JIRA)[https://issues.apache.org/jira/browse/MILAGRO/?selectedTab=com.atlassian.jira.jira-projects-plugin:summary-panel].

Therefore the Milagro Project has adopted a similar lifecycle process as follows:

Projects are in one of five possible states:
* _Proposal_
* _Inception_
* _Mature_
* _Deprecated_
* _End of Life_

Projects may not necessarily move through those states in a linear way and may go through several iterations.

## Proposal
Project Proposals shall be submitted to the dev.milagro.apache.org mailling list for review, using a [Proposal Template](../wiki/Proposal-Template-for-a-Hyperledger-Improvement-Project-%28HIP%29). Proposals that are approved by a majority of project committers shall enter into an _Inception_ state, unless they are of a refactoring nature, in which case they will be turned over to the relevant project maintainer(s) to handle as they deem fit.

A Proposal must:
* have a clear description
* have a well-defined scope
* identify committed development resources
* identify initial maintainers
* be vendor neutral

## Incubation
Approved project proposals enter into _Inception_. For new components/modules, a new folder will be created under the main Apache Milagro (incubating) subversion repository. New features/capabilities should be handled through pull requests labeled with tags that identify the project and tag it as "inception" (and will ideally be capable of being enabled/disabled with feature-flags).

On the Documentation portal, new projects in _Inception_ should be clearly marked at the top of the Introduction page.

Projects in _Inception_ may overlap with one another. Entering _Inception_ is meant to be fairly easy to allow for community exploration of different ideas.

Once a project reaches a mature state, the project’s maintainers can then vote to request a graduation review by Milagro committers to be declared _Mature_.

Projects seeking to graduate from _Inception_ must:
* have fully functional code base
* have good to excellent test coverage commensurate with other mature projects
* have an active and diverse community of developers
* have a history of releases that follow the mature release process
* rely on pairing-protocols that have been adequately peer reviewed

Entering _Inception_ does not guarantee that the project will eventually get to _Mature_ state. Projects may never get to _Mature_ state.

## Cryptographic Peer review
For projects in _Inception_ that propose to use new protocols that have not been published or faced qualified peer review, the _Inception_ phase should include an action to publish the protocol through ePrint or other cryptographic review forums, with the intention of gathering the widest peer review possible. Projects that rely on protocols that have not faced substantive review will not graduate from _Inception_.

## Mature
Projects that have successfully exited the _Inception_ phase are in the _Mature_ phase.

Anyone may propose that a project be deprecated, by submitting a rationale and identifying a substitute project/component (if any). The maintainers of the project shall vote on such a request and if it passes, make that recommendation to the Milagro committers and PMC. Members of the community and PMC that disagree with the request shall make their case before the committers and PMC. All shall consider all points of view and render a final decision to deprecate or not.

## Deprecated
A _Deprecated_ project will be maintained according to the rules of the Apache Way. After the six-month deprecation period, the project will be labeled _End of Life_ while the code will always be made available.

## End of Life
A project that is no longer actively developed or maintained.

Many thanks to the HyperLedger project for their proposal templates.
