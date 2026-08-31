/**
 * Ajusta o <title> e a meta description da página atual.
 * Sem isso as páginas de peça herdam a descrição da home, e todo link
 * compartilhado sai com o mesmo resumo.
 */
export function definirMeta(titulo: string, descricao: string) {
  document.title = titulo

  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!tag) {
    tag = document.createElement('meta')
    tag.name = 'description'
    document.head.appendChild(tag)
  }
  tag.content = descricao
}
