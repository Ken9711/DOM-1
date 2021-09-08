window.dom = {
    create(string) {
        // template 可以容纳任意元素
        const container = document.createElement("template");
        // trim()用来去除两边的空格
        container.innerHTML = string.trim();
        return container.content.firstChild;
    },
    after(node, node2) {
        node.parentNode.insertBefore(node2, node.nextSibling);
    },
    before(node, node2) {
        node.parentNode.insertBefore(node2, node);
    },
    append(parent, node) {
        parent.appendChild(node);
    },
    wrap(node, parent) {
        dom.before(node, parent);
        // append 有一个特点，它插到别的地方，就不在原来的地方了。
        dom.append(parent, node);
    },
    remove(node) {
        node.parentNode.removeChild(node);
        return node;
    },
    empty(node) {
        // 这句话等价于 const childNodes = node.childNodes;
        const { childNodes } = node;
        const array = [];
        while (childNodes[0]) {
            array.push(dom.remove(childNodes[0]));
        }
        return array;
    },
    attr(node, name, value) {   // 重载(根据参数个数不同进行不同的操作)
        if (arguments.length === 3) {
            return node.setAttribute(name, value)   // 如果传了三个参数，那么就设置属性和值
        } else if (arguments.length === 2) {
            return node.getAttribute(name)   // 如果传了两个参数，那么就读取属性的值
        }
    },
    text(node, string) {
        // 参数为两个时，text功能是修改和设置内容，参数一个时，功能变为读取内容
        if (arguments.length === 2) {
            if ('innerText' in node) {
                node.innerText = string // ie
            } else {
                node.textContent = string
            }
        } else if (arguments.length === 1) {
            if ('innerText' in node) {
                return node.innerText
            } else {
                return node.textContent
            }
        }
    },
    html(node, string) {
        if (arguments.length === 2) {
            node.innerHTML = string
        } else if (arguments.length === 1) {
            return node.innerHTML
        }
    },
    style(node, name, value) {
        if (arguments.length === 3) {
            // dom.style(div, 'color', 'red')
            node.style[name] = value
        } else if (arguments.length === 2) {
            if (typeof name === 'string') {
                // dom.style(div, 'color')
                return node.style[name]
            } else if (name instanceof Object) {
                // dom.style(div, {color: 'red'})
                const object = name;
                for (let key in object) {
                    // object[key]的结果是值，不是属性名
                    console.log(object[key]);
                    node.style[key] = object[key]
                }
            }
        }
    },
    class: {
        add(node, className) {
            node.classList.add(className)
        },
        remove(node, className) {
            node.classList.remove(className)
        },
        has(node, className) {
            return node.classList.contains(className)
        }
    },
    on(node, eventName, fn) {
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn) {
        node.removeEventListener(eventName, fn)
    },
    find(selector, scope) {
        // scope 表示范围。如果给定了范围就在范围内寻找，否则在document里寻找。
        return (scope || document).querySelectorAll(selector)
    },
    parent(node) {
        return node.parentNode
    },
    children(node) {
        return node.children
    },
    siblings(node) {
        return Array.from(node.parentNode.children)
            .filter(n => n !== node)
    },
    next(node) {
        let x = node.nextSibling
        while (x && x.nodeType === 3) {
            x = x.nextSibling
        }
        return x
    },
    previous(node) {
        let x = node.previousSibling
        while (x && x.nodeType === 3) {
            x = x.previousSibling
        }
        return x
    },
    each(nodeList, fn) {
        for (let i = 0; i < nodeList.length; i++) {
            fn.call(null, nodeList[i])
        }
    },
    index(node) {
        const list = dom.children(node.parentNode)
        let i
        for (i = 0; i < list.length; i++) {
            if (list[i] === node) {
                break
            }
        }
        return i
    }
};