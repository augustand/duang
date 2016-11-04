def((Item) => class extends Item {
  get template() {
    return `
      <dl>
        <dt><a href="JavaScript:">{text}</a></dt>
        <dd>{key}</dd>
      </dl>
    `;
  }
  init() {
    if (this.currentKey === this.key) this.element.classList.add('active');
    this.text = this.title || this.key.replace(/([^/]{2})[^/]{3,}\//g, '$1../');
    this.element.dataset.char = this.text ? this.text[0] : 'X';
  }
  onClick() {
    let { module = 'list', key, where = {}, params = {} } = this;
    let tasks = [];
    if (this['@where']) tasks.push(api([ this.key, this['@where'] ]).then(result => where = result));
    if (this['@params']) tasks.push(api([ this.key, this['@params'] ]).then(result => params = result));
    const done = () => {
      where = JSON.stringify(where);
      params = JSON.stringify(params);
      location.hash = '#' + new UParams({ module, key, where, params });
    };
    tasks.length ? Promise.all(tasks).then(done) : done();
  }
  get styleSheet() {
    let radius = 40;
    let padding = 12;
    return `
      :scope {
        position: relative;
        border: 1px solid #EFF2F7;
        width: calc(33.33% - 2em);
        display: inline-block;
        box-sizing: border-box;
        margin: 1em;
        line-height: 20px;
        font-size: 13px;
        list-style: none;
        white-space: nowrap;
        padding: ${padding}px;
        padding-left: ${radius + padding * 2}px;
        transition: background 200ms ease;
        color: #324057;
        overflow: hidden;
        &.active {
          color: #20A0FF;
        }
        &:hover {
          background: #F9FAFC;
        }
        &::before {
          position: absolute;
          content: attr(data-char);
          display: inline-block;
          border-radius: 100%;
          background: #58B7FF;
          width: ${radius}px;
          height: ${radius}px;
          line-height: ${radius}px;
          font-size: 16px;
          color: #fff;
          vertical-align: middle;
          text-align: center;
          top: ${padding}px;
          left: ${padding}px;
        }
        dd {
          margin: 0;
          color: #c0ccda;
          transform: scale(.8);
          transform-origin: left;
        }
        a {
          font-weight: 500;
          color: #1F2D3D;
          display: inline-block;
          vertical-align: middle;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    `;
  }
});