_generateSource(eventToSync) {
  let css = "";
  for(let index=0; index<eventToSync.dependencies.length; index++) {
    const dependency = eventToSync.dependencies[index];
    css += `/*!original:${this.moduler.relpathOf(dependency.id)}*/\n`;
    css += `/*!order:${index+1}*/\n`;
    css += `${dependency.source}\n\n`;
  }
  eventToSync.source = css;
}