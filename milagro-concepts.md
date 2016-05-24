---
currentMenu: milagro-concepts
layout: markdeep
---
<style>h1:before, h2:before { content: none; }</style>

# Milagro Concepts

One of the critical points about information security is to give access to resources only to authorised entities and deny access to unauthorised ones.
Preventing unauthorised access very often comes down to making it almost impossible, i.e., tough, expensive, complicated, time-consuming for the unauthorised entities to get access to resources.

The same principles apply to cryptography. In most cases, a suitable encryption mechanism satisfies at least two basic requirements:
1. It is possible to give easy access to encrypted, cryptographically protected) content to authorised people entities.
2. It is possible to make it extremely challenging for unauthorised people to access encrypted (ditto) content.

Using the above, we can define an operation: For example, encryption that is tough to reverse without possessing a particular parameter, for example, a decryption key.
One example is typically prime number factorization in RSA-based encryption algorithm: two big prime numbers are multiplied to generate a public key so that it is almost impossible to reverse the operation and retrieve the original prime numbers.

Multiple sources are available online to read more on the topic, one option is the paper at this (link)[https://math.berkeley.edu/~kpmann/encryption.pdf].
