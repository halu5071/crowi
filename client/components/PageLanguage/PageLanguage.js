import React from 'react'
import PropTypes from 'prop-types'
import { translate } from 'react-i18next'
import { Input } from 'reactstrap'
import { throttle } from 'throttle-debounce'

class PageLanguage extends React.Component {
  constructor(props) {
    super(props)

    const languages = this.props.crowi.getLanguages()
    this.state = {
      language: document.getElementById('page-language').dataset.language,
      languages,
    }

    this.removeCodeBlock = this.removeCodeBlock.bind(this)
    this.updateLanguageField = this.updateLanguageField.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  removeCodeBlock(markdown) {
    return markdown.replace(/```\w*\n[\s\S]*?\n```/g, '')
  }

  updateLanguageField() {
    const formBody = document.getElementById('form-body').value
    const markdown = this.removeCodeBlock(formBody)
    const japansese = markdown.match(/[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+/g)
    const japaneseLength = japansese === null ? 0 : japansese.map(({ length }) => length).reduce((p, c) => p + c)
    const contentsLength = markdown.length
    const language = japaneseLength / contentsLength > 0.1 ? 'ja' : 'en'
    if (language !== this.state.language) {
      this.setState({ language })
    }
    console.log(language)
  }

  onChange(e) {
    this.setState({ language: e.target.value })
  }

  componentDidMount() {
    document.getElementById('form-body').addEventListener('input', throttle(1000, this.updateLanguageField))
    this.updateLanguageField()
  }

  render() {
    const { t } = this.props
    const { language: languageCode, languages } = this.state
    const languageName = code => t(`languages.${code}`)
    return (
      <Input className="mr-2" type="select" name="pageForm[language" value={languageCode} onChange={this.onChange}>
        {languages.map(code => (
          <option key={code} value={code}>
            {languageName(code)}
          </option>
        ))}
      </Input>
    )
  }
}

PageLanguage.propTypes = {
  crowi: PropTypes.object.isRequired,
  pageId: PropTypes.string,
  t: PropTypes.func.isRequired,
}

PageLanguage.defaultProps = {}

export default translate()(PageLanguage)
